/**
 * Convert string to html collection
 * @param {string[]} strings
 * @param  {...any} values
 * @returns Element|HTMLCollection
 */
export function tpl(strings, ...values) {
  const htmlString = String.raw({ raw: strings }, ...values);
  const div = document.createElement("div");
  div.innerHTML = htmlString;
  if (div.childElementCount > 1) {
    return div.children;
  }

  return div.children[0];
}

/**
 * transform css classes
 *
 * classList('first second', 'third', ['fourth','fifth'], {sixth: true, seventh: false})
 * returns ['first', 'second', 'third', 'fourth','fifth', 'sixth']
 *
 * why? Can be easily used with someDomNode.classList.add(...classList('whatevs', 'second-class', {etc:true}));
 *
 * @param  {...any} classes
 * @returns string[]
 */
export function classList(...classes) {
  const cssClasses = [];
  classes
    .filter((cssClass) => Boolean(cssClass))
    .forEach((cssClass) => {
      if (typeof cssClass === "string") {
        cssClasses.push(...cssClass.split(" "));
      } else if (Array.isArray(cssClass)) {
        cssClasses.push(...cssClass);
      } else if (typeof cssClass === "object") {
        Object.keys(cssClass).forEach((key) => {
          if (Boolean(cssClass[key])) {
            cssClasses.push(key);
          }
        });
      } else {
        throw new Error(
          `Cannot parse css class ${cssClass}. Unknown type & don't know how to parse (yet)`
        );
      }
    });

  return cssClasses;
}

function addSpectrum() {
  document.body.classList.add(
    "spectrum",
    "spectrum--medium",
    "spectrum--light"
  );
}

export function initializeSDPage() {
  addSpectrum();
}
