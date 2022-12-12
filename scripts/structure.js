/**
 * Convert string to html collection
 * @param {string[]} strings
 * @param  {...any} values
 * @returns Element|HTMLCollection
 */
export function tpl(strings, ...values) {
  const transformedValues = values.map((value) => {
    if (Array.isArray(value)) {
      return value.join(``);
    }
    if (typeof value[Symbol.iterator] === "function") {
      return [...value].join("");
    }
  });
  const htmlString = String.raw({ raw: strings }, ...transformedValues);
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

/**
 *
 * @param  {...any} classes
 * @returns string
 */
export function classListStr(...classes) {
  return classList(...classes).join(" ");
}

/**
 * "This string Is Transformed" -> "this_string_is_transformed"
 * @param {string} str
 */
export function stringToKey(str) {
  return str.toLowerCase().replace(" ", "_");
}

function addSpectrum() {
  document.body.classList.add(
    ...classList("spectrum spectrum--medium spectrum--light")
  );
  document.querySelector("html").setAttribute("dir", "ltr");
  document.querySelector("html").setAttribute("lang", "en");
}

export function initializeSDPage() {
  addSpectrum();
}
