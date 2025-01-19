import { elm, frag, useSignal, wrap } from "@amodx/elm";

elm.css(/* css */ `
.collapsible-section {

  .collapsible-section-title {
    display: flex;
    flex-direction: row;
    align-items: center;
    border-bottom: 1px solid #f1f1f1;

    .title {
      user-select: none;
    }

    .expand-button {
      margin-left: auto;
        &.expanded {
          transform: rotateZ(180deg);
          transition: 0.25s;
        }
        &.closed {
          transform: rotateZ(0deg);
          transition: 0.25s;
      }
    }
  }

  .collapsible-section-content {
      &.expanded {
          display: block;
      }
      &.closed {
        display: none;  
      }
  }
  
}
`);

const svgIcon = elm.html(/* html */ `
<svg
  width="20"
  height="20"
  viewBox="0 0 20 20"
  fill="none"

  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M16.5999 7.45898L11.1666 12.8923C10.5249 13.534 9.4749 13.534 8.83324 12.8923L3.3999 7.45898"
    stroke="white"
    stroke-miterlimit="10"
    stroke-linecap="round"
    stroke-linejoin="round"
  />
</svg>
  `);
export default wrap<
  {
    title: string;
  },
  "div"
>("div", true, ({ title }, children) => {
  const expanded = useSignal(false);

  return elm(
    "div",
    "collapsible-section",
    elm(
      "div",
      {
        className: "collapsible-section-title",
        signal: expanded(() => {}),
        onclick() {
          expanded.value = !expanded.value;
        },
      },
      elm("div", "title", title),
      elm(
        "div",
        {
          className: "expand-button closed",
          signal: expanded((elm) =>
            elm.classList.replace(
              expanded.value ? "closed" : "expanded",
              expanded.value ? "expanded" : "closed"
            )
          ),
        },
        svgIcon
      )
    ),
    elm(
      "div",
      {
        className: "collapsible-section-content closed",
        signal: expanded((elm) =>
          elm.classList.replace(
            expanded.value ? "closed" : "expanded",
            expanded.value ? "expanded" : "closed"
          )
        ),
      },
      ...children
    )
  );
});
