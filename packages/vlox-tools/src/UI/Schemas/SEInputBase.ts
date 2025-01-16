import { animate, wrap } from "@amodx/elm";
import { SEInputBaseProps, SEProps } from "./SEInputElement";
import { useSignal, elm } from "@amodx/elm";
export const SEInputBase = wrap<SEProps, "div">(
  "div",
  true,
  (props, children) => {
    const inputMessages = elm("div");
    const { node, schema } = props;

    schema.validate.subscribe(node, async () => {
      let error = false;
      if (!node.isEnabled()) return true;
      await node.validate();
      const response = node.validatorResponse;
      if (response.success) {
        error = false;
        inputMessages.innerHTML = "";
        return true;
      }
      error = true;
      const element = elm("div", {
        className: "form-messages",
      });
      if (response.errors) {
        for (const { id, errorMessage } of response.errors) {
          element.append(
            elm("p", {
              className: "form-error",
            }),
            errorMessage
          );
        }
      }
      inputMessages.innerHTML = "";
      inputMessages.append(element);
      return false;
    });

    const conditionsSignal = useSignal();

    return elm(
      "div",
      {
        className: `form-group ${node.isEnabled() ? "enabled" : "disabled"}`,
        signal: [
          conditionsSignal(async (el) => {
            if (!node.isEnabled()) {
              if (
                el.className.includes("form-group") &&
                el.classList.contains("enabled")
              )
                await animate(
                  el,
                  [
                    { height: `${el.getBoundingClientRect().height}px` },
                    { height: "0px" },
                  ],
                  250
                );

              el.classList.add("disabled");
              el.classList.remove("enabled");
            } else {
              if (!el.classList.contains("enabled")) {
                el.classList.add("enabled");
                el.classList.remove("disabled");
                if (el.className.includes("form-group"))
                  await animate(
                    el,
                    [
                      { height: "0px" },
                      { height: `${el.getBoundingClientRect().height}px` },
                    ],
                    250
                  );
              }
            }
          }),
        ],
      },
      elm("label", "label", node.property.name),
      ...children,
      inputMessages
    );
  }
);
