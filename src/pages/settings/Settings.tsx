import React, { useContext, useEffect, useState, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';
import ReactSelect from 'react-select';
import Clock from '../../components/Clock/Clock';
import { useDate } from '../../hooks/useDate';
import { AppContext } from '../../State';
import { SettingObject, SettingsCategory, SettingValueType } from '../../util/util';

import './Settings.css';

const Settings: React.FC = () => {

  const [appContext, dispatch] = useContext(AppContext);

  const [selectedCategory, setSelectedCategory] = useState(undefined as SettingsCategory | undefined);

  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    dispatch({ type: 'setTitle', title: 'SI Configuración' })
  }, []);

  function handleClick() {
    setRedirect(true);
  }

  function categorySelection(categoryIndex: number) {
    const tempCategory = appContext.settings.categories[categoryIndex];
    setSelectedCategory(tempCategory);
  }

  function getSettingInput(setting: SettingObject) {
    let input: ReactElement;

    switch (setting.type) {
      case SettingValueType.List: {

        const options = [];

        if (setting.possibleValues) {
          for (let i = 0; i < setting.possibleValues.length; i++) {
            options.push(
              <option key={i} value={setting.possibleValues[i].value}>{setting.possibleValues[i].displayName}</option>
            );
          }
        }

        input =
          (
            <select className='select-input' name={setting.name} id={setting.name} defaultValue={setting.value}>
              {options}
            </select>
          );
      };
        break;

      case SettingValueType.Boolean: {
        input =
        (
          <select className='select-input' name={setting.name} id={setting.name} defaultValue={setting.value}>
            <option value="true">Activado</option>
            <option value="false">Desactivado</option>
          </select>
        );
        break;
      }
      default: {
        input = <div>No implementado</div>
      }
        break;
    }

    return input;
  }

  if (redirect) {
    return (
      <Navigate to="/" />
    );
  }

  return (
    <div className='container'>
      <div className='c-header'>
        <button className='back-button fade-in-right' onClick={handleClick}>
          <i className='fa-solid fa-arrow-left'></i>
        </button>
        <Clock className='fade-in-right delay-3' />
        <span className='title fade-in-right delay-3'>Configuración</span>
      </div>
      <div className='c-body'>
        <div className='settings-container'>
          <div className='categories'>
            {appContext.settings.categories.map((category: SettingsCategory, index: number) => (
              <button className={`setting-category fade-in-up delay-${(index + 1) * 2} ${selectedCategory === category ? 'active' : ''}`} key={index} onClick={() => { categorySelection(index); }}>
                <i className={`fa-solid ${category.icon}`}></i>
                <span className='setting-name'>{category.displayName}</span>
              </button>
            ))}
          </div>
          <div className='display fade-in-up delay-7'>
            {
              selectedCategory ?
                (
                  <>
                    <span className='title'>{selectedCategory.displayName}</span>
                    <span className='description info-text'>{selectedCategory.description}</span>
                    {selectedCategory.settings.map((setting: SettingObject, index: number) => (
                      <div className='setting' key={`setting-${index}`}>
                        <span className='setting-name'>{setting.displayName}</span>
                        <span className='setting-description info-text' style={{ marginBottom: '0.5rem' }}>{setting.description}</span>
                        {getSettingInput(setting)}
                      </div>
                    ))}
                  </>
                ) :
                (
                  <div className='no-category'>
                    Seleccione una categoría para ver las opciones
                  </div>
                )
            }
          </div>
        </div>
      </div>
      <div className='c-footer'></div>
    </div>
  );
};

export default Settings;
