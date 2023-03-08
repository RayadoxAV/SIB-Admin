import { FastField } from 'formik';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckBox from '../Checkbox/CheckBox';
import Dialog from '../Dialog/Dialog';
import SelectionActionCenter from '../selection-action-center/SelectionActionCenter';

import './Table.css';

interface TableHeader {
  displayName: string;
  name: string;
}

interface TableProps {
  headers: TableHeader[];
  data: any[];
  className?: string;
  onSelectionChange?: Function;
  informationRoute?: string;
  searchable?: boolean;
  searchParams?: string[];
  selectable?: boolean;
  clickable?: boolean;
  editable?: boolean;
  addUrl?: string;
  performDelete?: Function;
  pageSize?: number;
}

const Table: React.FC<TableProps> =
  ({
    headers,
    data,
    className,
    onSelectionChange,
    informationRoute,
    searchable,
    searchParams = [],
    selectable,
    clickable,
    editable = false,
    addUrl,
    performDelete,
    pageSize = 10
  }) => {

    const navigate = useNavigate();

    const [selectedRows, setSelectedRows] = useState(new Set<number>());
    const [selectedQuantity, setSelectedQuantity] = useState(0);
    const [shouldShowSAC, setShouldShowSAC] = useState(false);
    const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
    const [resetPulse, setResetPulse] = useState(false);

    const [rows, setRows] = useState([] as any);
    const [searchRows, setSearchRows] = useState([] as any);
    const [pages, setPages] = useState([] as any);
    const [pageButtons, setPageButtons] = useState(undefined as any);
    const [currentPageIndex, setCurrentPageIndex] = useState(0);

    useEffect(() => {
      setRows(data);
      setSearchRows(data);
    }, [data]);

    useEffect(() => {
      generatePages();
    }, [searchRows, pageSize]);

    function handleSelection(checked: boolean, index: number) {
      const tempSelectedRows = selectedRows;
      if (tempSelectedRows.has(index)) {
        tempSelectedRows.delete(index);
      } else {
        tempSelectedRows.add(index);
      }

      if (tempSelectedRows.size > 0) {
        setShouldShowSAC(true);
      } else {
        setShouldShowSAC(false);
      }
      setSelectedQuantity(tempSelectedRows.size);
      setSelectedRows(tempSelectedRows);

      document.getElementById(`row-${index}`)?.classList.toggle('selected');
    }

    function handleAdd() {
      navigate(`${addUrl}`);
    }

    function search(event: any) {
      removeSelection();
      const searchValue = event.target.value.trim().toLowerCase();
      if (!searchValue) {
        setSearchRows(rows);
      } else {
        const searchedRows = [] as any[];

        for (let i = 0; i < rows.length; i++) {
          if (determineElegibility(rows[i], searchValue)) {
            searchedRows.push(rows[i]);
          }
          // if (rows[i].nombre.toLowerCase().includes(searchValue) || rows[i].matricula.includes(searchValue) || rows[i].CURP.toLowerCase().includes(searchValue) || `grado:${rows[i].grado}`.includes(searchValue) || `grupo:${rows[i].grupo.toLowerCase()}`.includes(searchValue)) {
          //   searchedRows.push(rows[i]);
          // }
          // console.log(rows[i]);
        }

        setSearchRows(searchedRows);
      }
    }

    function determineElegibility(dataRow: any, searchValue: string): boolean {
      let elegible = false;
      for (let i = 0; i < searchParams.length; i++) {
        const searchParam = searchParams[i];
        if (!searchParam.includes(':')) {
          elegible = `${dataRow[`${searchParam}`]}`.toLowerCase().includes(searchValue);
          if (elegible) {
            return true;
          }
        } else {
          const param = searchValue.split(':')[0];
          let elegible = `${searchParam.split(':')[0]}:${`${dataRow[param]}`.toLowerCase()}`.includes(searchValue);
          if (elegible) {
            return true;
          }
        }
      }
      return false;
    }

    function removeSelection() {
      const tempSelectedRows = selectedRows;

      tempSelectedRows.forEach((index: any) => {
        document.getElementById(`row-${index}`)?.classList.remove('selected');
      });

      tempSelectedRows.clear();
      setSelectedRows(tempSelectedRows);
      setSelectedQuantity(0);

      const tempReset = resetPulse;
      setResetPulse(!tempReset);
    }

    function formatRole(role: number): string {
      switch (role) {
        case 0:
          return 'Raiz';
        case 1:
          return 'Administrador';
        case 2:
          return 'Usuario';
        case 5:
          return 'Invitado';
      }
      return '';
    }

    async function onDelete() {
      const result = await confirm('¿Está seguro que desea eliminar estos elementos? Esta acción no se puede deshacer.');
      if (result) {
        if (performDelete) {
          performDelete(selectedRows);
          setDeleteDialogVisible(true);
        }
      } else {
        alert('Acción cancelada');
      }
    }

    function generatePages() {
      const tempPages = [];

      let tempRows = [];
      for (let i = 1; i <= searchRows.length; i++) {
        let row = generateRow(i - 1, searchRows[i - 1]);
        tempRows.push(row);
        if (i % pageSize === 0) {
          const page =
            <React.Fragment key={i}>
              {tempRows}
            </React.Fragment>;
          tempPages.push(page);
          tempRows = [];
        }
      }

      if (tempRows.length > 0) {
        const page =
          <React.Fragment key='last-page'>
            {tempRows}
          </React.Fragment>
        tempPages.push(page);
      }
      // const tempButtons = generateButtons(tempPages);

      // setPageButtons(tempButtons);
      setPages(tempPages);
    }

    // function generateButtons(tempPages: JSX.Element[]) {

    //   const buttons =


    //   return buttons;
    // }

    function goToPage(pageIndex: number) {
      setCurrentPageIndex(pageIndex);
    }

    function generateRow(index: number, dataRow: any) {
      let row =
        <tr id={`row-${index}`} className='tr' key={index}>
          <>
            {
              selectable ?
                (
                  <td className='td'>
                    <CheckBox key={`${resetPulse}`} onChange={(checked: boolean) => handleSelection(checked, index)} />
                  </td>
                ) :
                (null)
            }
            {
              headers.map((header: any, cellIndex: number) => {
                if (header.name === 'estado') {
                  return (
                    <td className='td' key={`${index}:${cellIndex}`}>
                      <span className={`${dataRow[header.name] === 0 ? 'active' : 'inactive'}`}>{dataRow[header.name] === 0 ? 'Activo' : 'Inactivo'}</span>
                    </td>
                  )
                } else if (header.name === 'role') {
                  return (
                    <td className='td' key={`${index}:${cellIndex}`}>
                      <span>{formatRole(dataRow[header.name])}</span>
                    </td>
                  );
                } else {
                  return (
                    <td className='td' key={`${index}:${cellIndex}`}>{(dataRow[header.name] === undefined || dataRow[header.name] === '') ? '-' : dataRow[header.name]}</td>
                  );
                }
              })
            }
            {
              clickable ?
                (
                  <td className='td' style={{ textAlign: 'center' }}>
                    <button className='info-button' onClick={() => { navigate(`${informationRoute}/${dataRow.id}`) }}>
                      <i className='fa-solid fa-ellipsis'></i>
                    </button>
                  </td>
                ) :
                (null)
            }
          </>
        </tr>;
      return row;
    }

    return (
      <>
        <div className='table-container'>
          {searchable ?
            (<div className='search-container fade-in-up delay-1'>
              <div className='input-column no-pad' style={{ flexGrow: '1' }}>
                <span className='input-label'>Buscar</span>
                <input type='text' name='search' id='search' className='input search' onChange={search} autoComplete='off' />
              </div>
              {addUrl ?
                (
                  <button className='button-primary' style={{ marginLeft: 'auto' }} onClick={handleAdd}>
                    <i className='fa-solid fa-add icon'></i>
                    Agregar
                  </button>
                ) :
                (null)}
            </div>) :
            (null)}
          <div className={`table-wrapper fade-in-up delay-3 ${className}`}>
            <table className='table'>
              <thead className='thead'>
                <tr className='tr'>
                  <>
                    {selectable ?
                      (<th className='th'></th>) :
                      (null)}
                    {headers.map((header: TableHeader, rowIndex: number) => (
                      <th className='th' key={rowIndex}>{header.displayName}</th>
                    ))}
                    {clickable ?
                      (<th className='th'></th>) :
                      (null)}
                  </>
                </tr>
              </thead>
              <tbody className='tbody'>
                {pages[currentPageIndex]}
              </tbody>
            </table>
          </div>
          {
            pages.length === 0 ?
              (null) :
              (
                <div className='page-buttons fade-in-up delay-3'>
                  <button className='page-button' onClick={() => { goToPage(0) }}><i className='fa-solid fa-backward'></i></button>
                  <button className='page-button' onClick={() => { goToPage(currentPageIndex - 1) }} disabled={currentPageIndex === 0}>{currentPageIndex === 0 ? '-' : currentPageIndex}</button>
                  <button className='page-button'>{currentPageIndex + 1}</button>
                  <button className='page-button' onClick={() => { goToPage(currentPageIndex + 1) }} disabled={currentPageIndex === pages.length - 1}>{currentPageIndex === pages.length - 1 ? '-' : currentPageIndex + 2}</button>
                  <button className='page-button' onClick={() => { goToPage(pages.length - 1) }}><i className='fa-solid fa-forward'></i></button>
                </div>
              )
          }
        </div>
        <SelectionActionCenter
          editable={(editable && selectedQuantity === 1)}
          selectionQuantity={selectedQuantity}
          handleClose={removeSelection}
          onDelete={onDelete} />

        <Dialog
          visible={deleteDialogVisible}
          title='Elementos eliminados'
          closable={true}
          onConfirm={() => { setDeleteDialogVisible(false); }}
          onClose={() => { setDeleteDialogVisible(false); }}
          onCancel={() => { setDeleteDialogVisible(false); }}
          prompt={true}>
          Elementos eliminados exitosamente
        </Dialog>
        {/* {shouldShowSAC ? <SelectionActionCenter /> : null} */}
      </>
    );
  };

export default Table;
