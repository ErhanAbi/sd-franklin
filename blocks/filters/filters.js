import {
  LitElement,
  html,
  render,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

import { classListStr, stringToKey } from "/scripts/structure.js";

class SDFilters extends LitElement {
  static properties = {
    filters: {},
    _searchTerm: { state: true },
    _openFilter: { state: true },
    _selectedFilter: { state: true },
  };

  constructor() {
    super();
    this._searchTerm = "";
    this._openFilter = null;
    this._selectedFilter = {};
  }

  _handleClickOutside = (ev) => {
    if (!ev.isTrusted) {
      return;
    }
    if (this._openFilter === null) {
      return;
    }
    if (ev instanceof KeyboardEvent && ev.key === "Escape") {
      this._openFilter = null;
    }

    if (
      !this.querySelector(`div[data-dropdown=${this._openFilter}]`).contains(
        ev.target
      )
    ) {
      this._openFilter = null;
    }
  };

  _handleDropdownSelection = (filterId, selection) => {
    this._selectedFilter = { ...this._selectedFilter, [filterId]: selection };
    this._openFilter = null;
    this._emitChange();
  };

  __timeout = null;
  _searchChange = (ev) => {
    clearTimeout(this.__timeout);
    this.__timeout = setTimeout(() => {
      if (ev instanceof Event && ev.isTrusted) {
        this._searchTerm = ev.target.value;
      } else if (typeof ev === "string") {
        this._searchTerm = ev;
      }

      this.querySelector("input[type='search']").value = this._searchTerm;

      if (!Boolean(ev)) {
        this._emitChange();
      }
    });
  };

  _resetFilters = () => {
    this.filters.forEach((filter) => {
      this._selectedFilter = {
        ...this._selectedFilter,
        [stringToKey(filter.label)]: filter.options[0],
      };
    });
    this._searchChange("");
    this._emitChange();
  };

  _hasFilters() {
    if (this._searchTerm) {
      return true;
    }
    const dropdownKey = Object.keys(this._selectedFilter).find((key) => {
      const dd = this.filters.find(
        (filter) => stringToKey(filter.label) === key
      );
      return this._selectedFilter[key] !== dd.options[0];
    });

    return Boolean(dropdownKey);
  }

  _emitChange() {
    setTimeout(() =>
      this.dispatchEvent(
        new CustomEvent("change:filters", {
          detail: {
            searchTerm: this._searchTerm,
            selectedOptions: this._selectedFilter,
            dd: this.filters,
          },
        })
      )
    );
  }

  connectedCallback() {
    super.connectedCallback();
    addEventListener("keydown", this._handleClickOutside);
    addEventListener("click", this._handleClickOutside);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    removeEventListener("keydown", this._handleClickOutside);
    removeEventListener("click", this._handleClickOutside);
  }

  render() {
    const currentDropdownSelection = this.filters.reduce(
      (accum, filter) => ({
        [stringToKey(filter.label)]: filter.options[0],
        ...accum,
      }),
      this._selectedFilter
    );

    return html`
      <div class="search-container">
        <label class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
          >Search</label
        >
        <form
          class="spectrum-Search sd-Search"
          @submit=${(ev) => {
            ev.preventDefault();
            this._emitChange();
          }}
        >
          <div class="spectrum-Textfield spectrum-Search-textfield">
            <svg
              class="spectrum-Icon spectrum-Icon--sizeM spectrum-Textfield-icon spectrum-Search-icon"
            >
              <path
                d="M16.5865,15.107,12.7,11.2215A6.413,6.413,0,1,0,11.2215,12.7l3.886,3.886a1.05,1.05,0,0,0,1.479-1.479ZM3,7.5A4.5,4.5,0,1,1,7.5,12,4.5,4.5,0,0,1,3,7.5Z"
                class="spectrum-UIIcon--medium"
              ></path>
            </svg>
            <input
              type="search"
              placeholder="Type here..."
              class="spectrum-Textfield-input spectrum-Search-input sd-Search-input"
              autocomplete="off"
              @keydown=${this._searchChange}
            />
          </div>
          <button
            type="reset"
            class="${classListStr(
              "spectrum-ClearButton spectrum-ClearButton--sizeM spectrum-Search-clearButton",
              { hidden: !Boolean(this._searchTerm) }
            )}"
            @click=${() => this._searchChange("")}
          >
            <div class="spectrum-ClearButton-fill">
              <svg
                class="spectrum-Icon spectrum-ClearButton-icon spectrum-UIIcon-Cross100"
              >
                <path
                  d="M7.317 6.433L4.884 4l2.433-2.433a.625.625 0 1 0-.884-.884L4 3.116 1.567.683a.625.625 0 1 0-.884.884L3.116 4 .683 6.433a.625.625 0 1 0 .884.884L4 4.884l2.433 2.433a.625.625 0 0 0 .884-.884z"
                  class="spectrum-UIIcon--medium"
                ></path>
              </svg>
            </div>
          </button>
        </form>
      </div>
      <div class="filter-toggle">
        <h4
          class="spectrum-Heading spectrum-Heading--sizeS spectrum-FilterToggle--label"
        >
          Filters
        </h4>
        <button
          type="reset"
          class="${classListStr(
            "spectrum-Button spectrum-Button--primary spectrum-Button--sizeS spectrum-Button--outline",
            { hidden: !this._hasFilters() }
          )}"
          @click=${this._resetFilters}
        >
          <span class="spectrum-Button-label">Reset</span>
        </button>
      </div>

      ${this.filters.map((currentFilter) => {
        const filterId = stringToKey(currentFilter.label);

        return html`<div class="dropdown-filter" data-dropdown="${filterId}">
          <label
            for="${filterId}"
            class="spectrum-FieldLabel spectrum-FieldLabel--sizeM"
            >${currentFilter.label}</label
          >
          <button
            class="${classListStr("spectrum-Picker spectrum-Picker--sizeM", {
              "is-open": this._openFilter === filterId,
            })}"
            aria-haspopup="listbox"
            @click=${() =>
              (this._openFilter = this._openFilter === null ? filterId : null)}
          >
            <span class="spectrum-Picker-label"
              >${currentDropdownSelection[filterId]}</span
            >
            <svg
              id="spectrum-css-icon-ChevronDownMedium"
              class="spectrum-Icon spectrum-UIIcon-ChevronDown100 spectrum-Picker-menuIcon"
              viewBox="0 0 10 10"
              focusable="false"
              aria-hidden="true"
            >
              <g id="ChevronSize100">
                <rect id="Frame" opacity="0"></rect>
                <path
                  d="M7.96423,5.18384A.87628.87628,0,0,0,7.999,5a.88.88,0,0,0-.03467-.18384.85473.85473,0,0,0-.02887-.14386.88334.88334,0,0,0-.12432-.18951.82653.82653,0,0,0-.064-.09754L7.7442,4.3833l-.004-.00586L3.61475.30225a.87492.87492,0,1,0-1.2295,1.24511L5.88007,5,2.38525,8.45264a.87492.87492,0,1,0,1.2295,1.24511L7.74023,5.62256l.004-.00586.00287-.00195a.81976.81976,0,0,0,.064-.0976.88482.88482,0,0,0,.12432-.18951A.85511.85511,0,0,0,7.96423,5.18384Z"
                ></path>
              </g>
            </svg>
          </button>
          <div
            class=${classListStr(
              "spectrum-Popover spectrum-Popover--bottom spectrum-Picker-popover",
              { "is-open": this._openFilter === filterId }
            )}
          >
            <ul class="spectrum-Menu" role="listbox">
              ${currentFilter.options.map((option, index) => {
                if (index === 0) {
                  return html`<li
                      class="${classListStr("spectrum-Menu-item", {
                        "is-selected":
                          currentDropdownSelection[filterId] === option,
                      })}"
                      role="option"
                      aria-selected="${classListStr({
                        true: currentDropdownSelection[filterId] === option,
                      })}"
                      tabindex=${index}
                      @click=${() =>
                        this._handleDropdownSelection(filterId, option)}
                    >
                      <span class="spectrum-Menu-itemLabel">${option}</span>
                      <svg
                        class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
                        focusable="false"
                        aria-hidden="true"
                      >
                        <path
                          d="M4.5 10a1.022 1.022 0 0 1-.799-.384l-2.488-3a1 1 0 0 1 1.576-1.233L4.5 7.376l4.712-5.991a1 1 0 1 1 1.576 1.23l-5.51 7A.978.978 0 0 1 4.5 10z"
                          class="spectrum-UIIcon--medium"
                        ></path>
                      </svg>
                    </li>
                    <li class="spectrum-Menu-divider" role="separator"></li>`;
                }

                return html`<li
                  class="${classListStr("spectrum-Menu-item", {
                    "is-selected":
                      currentDropdownSelection[filterId] === option,
                  })}"
                  role="option"
                  aria-selected="${classListStr({
                    true: currentDropdownSelection[filterId] === option,
                  })}"
                  tabindex=${index}
                  @click=${() =>
                    this._handleDropdownSelection(filterId, option)}
                >
                  <span class="spectrum-Menu-itemLabel">${option}</span>
                  <svg
                    class="spectrum-Icon spectrum-UIIcon-Checkmark100 spectrum-Menu-checkmark spectrum-Menu-itemIcon"
                    focusable="false"
                    aria-hidden="true"
                  >
                    <path
                      d="M4.5 10a1.022 1.022 0 0 1-.799-.384l-2.488-3a1 1 0 0 1 1.576-1.233L4.5 7.376l4.712-5.991a1 1 0 1 1 1.576 1.23l-5.51 7A.978.978 0 0 1 4.5 10z"
                      class="spectrum-UIIcon--medium"
                    ></path>
                  </svg>
                </li>`;
              })}
            </ul>
          </div>
        </div>`;
      })}
    `;
  }

  createRenderRoot() {
    return this;
  }
}
customElements.define("sd-filters", SDFilters);

/**
 * @param {Element} block
 */
function getParsedFilters(block) {
  const filters = [...block.querySelectorAll(":scope > div")].map(
    (filterBlock) => {
      const labelContainer = filterBlock.querySelector(":scope > :first-child");
      const options = [...filterBlock.querySelectorAll(":scope ul > li")].map(
        (el) => el.textContent
      );
      return { label: labelContainer.textContent, options };
    }
  );
  return filters;
}

/**
 * @param {Element} block
 */
export default function decorateFilters(block) {
  const filters = getParsedFilters(block);
  block.innerHTML = "";
  render(html`<sd-filters .filters=${filters} />`, block);
}
