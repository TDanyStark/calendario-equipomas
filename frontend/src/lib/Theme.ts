interface Props{
  gridTemplateColumns: string;
  heightRow: number;
}

const Theme = ({gridTemplateColumns, heightRow}: Props) => {
  return {
      Table: `
            ${
              gridTemplateColumns
                ? `--data-table-library_grid-template-columns: ${gridTemplateColumns};`
                : ""
            }
            border-spacing: 0;
            border-collapse: collapse;
            width: 100%;
            font-size: 16px;
            border: 1px solid white;
          `,
      Header: `
            
      `,
      Body: ``,
      BaseRow: `
            background-color: #000000;
            &.row-select-selected, &.row-select-single-selected {
              background-color: #000275 !important;
              font-weight: 400;
              color: #ffffff;
            }
          `,
      HeaderRow: `
            font-size: 20px;
            
            .th {
              border-bottom: 1px solid white;
            }
              div{
                font-weight: 300;
              }
          `,
      Row: `
            font-size: 16px;
            &:not(:last-of-type) .td {
              border-bottom: 1px solid white;
            }
            &:nth-of-type(odd) {
              background-color: #171717;
            }
            &:nth-of-type(even) {
              background-color: #000000;
            }
            &:hover {
              background-color: #000275;
            }
          `,
      BaseCell: `
            border-right: 1px solid white;
            padding: 8px;
            height: ${heightRow}px;
            text-align: center;
            svg {
              fill: var(--theme-ui-colors-text);
            }
          `,
      HeaderCell: `
            
            div div{
              justify-content: center;
              gap: 10px;
            }
            div div span svg{
              fill: #cacaca;
            }
          `,
      Cell: `
        div{
          padding: 3px;
        }
      `,
    };
};

export default Theme;