import {
  LitElement,
  html,
  render,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

import { classListStr, stringToKey } from "/scripts/structure.js";
import { resultsData } from "./results-data.js";

class ResultsTable extends LitElement {
  static properties = {
    columns: {},
    _sortedCol: { state: true },
    _sortedOrder: { state: true },
    _tableData: { state: true },
    _filters: { state: true },
  };

  constructor() {
    super();

    this._sortedCol = "";
    this._sortedOrder = "desc";
    this._tableData = [...resultsData];
    this._filters = {};
  }

  _handleSort = (colToSort) => {
    const col = stringToKey(colToSort);
    const collator = new Intl.Collator();

    if (col !== this._sortedCol) {
      this._sortedCol = col;
      this._sortedOrder = "desc";
    } else {
      this._sortedOrder = this._sortedOrder === "desc" ? "asc" : "desc";
    }

    const sortedData = [...resultsData].sort((a, b) => {
      let comparisonResult;
      if (this._sortedCol === "size") {
        comparisonResult = parseFloat(a.size) - parseFloat(b.size);
      } else {
        comparisonResult = collator.compare(
          a[this._sortedCol],
          b[this._sortedCol]
        );
      }

      return this._sortedOrder === "desc"
        ? -comparisonResult
        : comparisonResult;
    });
    this._tableData = sortedData;
  };

  _handleFiltersChanged = (ev) => {
    this._filters = ev.detail;
  };
  connectedCallback() {
    super.connectedCallback();
    document
      .querySelector("sd-filters")
      .addEventListener("change:filters", this._handleFiltersChanged);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    document
      .querySelector("sd-filters")
      .removeEventListener("change:filters", this._handleFiltersChanged);
  }

  _getFilteredResults() {
    const results = this._tableData
      .filter((row) => {
        if (!Boolean(this._filters.searchTerm)) {
          return true;
        }
        return row.title
          .toLowerCase()
          .includes(this._filters.searchTerm.toLowerCase());
      })
      .filter((row) => {
        if (!Boolean(this._filters.selectedOptions)) {
          return true;
        }
        let result = true;
        Object.keys(this._filters.selectedOptions).forEach((optionGroup) => {
          const value = this._filters.selectedOptions[optionGroup];
          if (
            result === false ||
            value.toLowerCase() === "all" ||
            row[optionGroup] === undefined
          ) {
            return;
          }

          if (Array.isArray(row[optionGroup])) {
            result = row[optionGroup]
              .map((el) => el.toLowerCase())
              .includes(value.toLowerCase());
          } else {
            result = row[optionGroup].toLowerCase() === value.toLowerCase();
          }
        });
        return result;
      });
    return results;
  }

  render() {
    const sortedCol =
      this._sortedCol || stringToKey(this.columns[this.columns.length - 1]);
    const sortedOrder = this._sortedOrder;

    const results = this._getFilteredResults();

    return html`<table class="spectrum-Table spectrum-Table--sizeM">
      <thead class="spectrum-Table-head">
        <tr>
          ${this.columns.map((column) => {
            return html`<th
              class="${classListStr(
                "spectrum-Table-headCell is-sortable",
                stringToKey(column),
                {
                  "is-sorted-desc":
                    stringToKey(column) === sortedCol && sortedOrder === "desc",
                  "is-sorted-asc":
                    stringToKey(column) === sortedCol && sortedOrder === "asc",
                }
              )}"
              aria-sort="descending"
              data-col="${stringToKey(column)}"
              @click=${() => this._handleSort(column)}
            >
              ${column}
              <svg
                viewBox="0 0 10 10"
                class="spectrum-Icon spectrum-UIIcon-ArrowDown100 spectrum-Table-sortedIcon"
                focusable="false"
                aria-hidden="true"
              >
                <g id="ArrowSize100">
                  <rect
                    id="Frame"
                    width="10"
                    height="10"
                    fill="red"
                    opacity="0"
                  ></rect>
                  <path
                    d="M9.94952,4.99652a.87815.87815,0,0,0-.02966-.15259.854.854,0,0,0-.03522-.17315L9.882,4.66217A.86384.86384,0,0,0,9.7464,4.459a.819.819,0,0,0-.04718-.07226l-.00488-.005-.00086-.00079L6.62354,1.26172A.87459.87459,0,1,0,5.37646,2.48828L6.98682,4.125H.9248a.875.875,0,0,0,0,1.75h6.062L5.37646,7.51172A.87459.87459,0,1,0,6.62354,8.73828l3.06994-3.1192.00086-.00079.00488-.005A.819.819,0,0,0,9.7464,5.541.86384.86384,0,0,0,9.882,5.33783l.00262-.00861a.854.854,0,0,0,.03522-.17315.87815.87815,0,0,0,.02966-.15259L9.9502,5Z"
                  ></path>
                </g>
              </svg>
            </th>`;
          })}
        </tr>
      </thead>
      <tbody class="spectrum-Table-body">
        ${results.map((row, idx) => {
          return html`<tr class="spectrum-Table-row">
            <td class="spectrum-Table-cell table-cell-first" tabindex="${idx}">
              <img
                class="spectrum-Asset-image spectrum-Asset-image--list"
                src="https://localhost${row.thumbnail}"
                alt="${row.title}"
              />
              <span class="package-title">${row.title}</span>
            </td>
            <td class="spectrum-Table-cell" tabindex="${idx}">${row.size}</td>
            <td class="spectrum-Table-cell" tabindex="${idx}">
              ${row.software_type}
            </td>
            <td class="spectrum-Table-cell" tabindex="${idx}">
              ${row.date_published}
            </td>
          </tr>`;
        })}
      </tbody>
    </table>`;
  }

  createRenderRoot() {
    return this;
  }
}

customElements.define("results-table", ResultsTable);

export default function decorateResults(block) {
  const tableCols = [...block.querySelectorAll(":scope > div div")].map(
    (div) => div.innerText
  );

  block.innerHTML = "";

  render(html`<results-table .columns=${tableCols} />`, block);
}
