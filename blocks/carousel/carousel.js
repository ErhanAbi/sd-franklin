import { classList, tpl } from "../../scripts/structure.js";

function decorateContainer() {
  const header = document.querySelector(
    "div.carousel-container div.default-content-wrapper h1"
  );
  header.classList.add(
    ...classList("spectrum-Heading spectrum-Heading--sizeM")
  );
}

/**
 * @param {Element} block
 */
function getTransformedItems(block) {
  const carouselItems = block.querySelectorAll(":scope > div");
  return [...carouselItems].map((item) => {
    item.classList.add("carousel-item");
    const [title, description, picture, buttonContainer] =
      item.querySelectorAll(":scope > div");
    title.classList.add(
      ...classList(
        "carousel-item-title spectrum-Heading spectrum-Heading--sizeM spectrum-Heading--light"
      )
    );
    description.classList.add(
      ...classList(
        "carousel-item-description spectrum-Body spectrum-Body--sizeS"
      )
    );
    picture.classList.add("carousel-item-picture");
    buttonContainer.classList.add("carousel-item-actions");
    [...buttonContainer.querySelectorAll("a")].forEach((anchor) => {
      anchor.classList.add(
        ...classList(
          "spectrum-Button spectrum-Button--outline spectrum-Button--primary spectrum-Button--sizeM"
        )
      );
      anchor.replaceChildren(
        tpl`<span class="spectrum-Button-label">${anchor.innerHTML}</span>`
      );
    });
    return item;
  });
}

/**
 * @param {Element} block
 */
function decorateBlock(block) {
  const innerBlocks = getTransformedItems(block).map((div) => div.outerHTML);

  const html = tpl`
    <div class="action action-previous">
        <button class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet">
            <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-ActionButton-icon" focusable="false" aria-hidden="true" aria-label="Previous" viewBox="0 0 12 16">
                <path d="M9.60475,13.84315l-6.054-5.84309L9.60719,2.1599A1.24776,1.24776,0,1,0,7.87556.363L.88232,7.1001A1.24336,1.24336,0,0,0,.88525,8.89685l6.98756,6.74256a1.24762,1.24762,0,1,0,1.73194-1.79626Z"></path>
            </svg>
        </button>
    </div>
    <div class="carousel-items">
        ${innerBlocks}
    </div>
    <div class="action action-next">
        <button class="spectrum-ActionButton spectrum-ActionButton--sizeM spectrum-ActionButton--quiet">
            <svg class="spectrum-Icon spectrum-Icon--sizeM spectrum-ActionButton-icon" focusable="false" aria-hidden="true" aria-label="Next" viewBox="0 0 12 16">
                <path d="M11.5,8a1.241,1.241,0,0,0-.38556-.897L4.12768.3601A1.248,1.248,0,1,0,2.39525,2.15685L8.44952,8.00006l-6.0572,5.84053A1.24781,1.24781,0,1,0,4.125,15.63667l6.9922-6.73677A1.24515,1.24515,0,0,0,11.5,8Z"></path>
            </svg>
        </button>
    </div>
    <ol class="indicators">
        ${innerBlocks.map(
          () =>
            `<li class="indicator indicator--active">
                <button class="indicator-btn spectrum-ActionButton spectrum-ActionButton--sizeS spectrum-ActionButton--quiet">
                    <svg class="spectrum-Icon spectrum-Icon--sizeS" viewBox="0 0 18 18">
                        <circle cx="9" cy="9" r="8"></circle>
                    </svg>
                </button>
            </li>`
        )}
    </ol>
  `;

  block.replaceChildren(...html);
}

/**
 * @param {Element} block
 */
export default function decorateCarousel(block) {
  decorateContainer();
  decorateBlock(block);
}
