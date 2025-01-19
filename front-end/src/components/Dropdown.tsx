import { useEffect, useRef, HTMLAttributes, useState } from "react";
import { GoChevronDown, GoChevronLeft } from 'react-icons/go';
import styles from './Dropdown.module.css'

export interface Option {
  label: string;
  value: string;
}

function Dropdown(
  { value, onChange, options, ...rest }:
    Omit<HTMLAttributes<HTMLElement>, 'onChange'> & {
      value: Option | null;
      onChange: Function;
      options: Option[];
    }) {
  const [isOpen, setIsOpen] = useState(false);
  const divEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (!divEl.current) {
        return;
      }

      if (!divEl.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handler, true);

    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  const handleOptionClick = (option: Option) => {
    onChange(option);
    setIsOpen(false);
  }

  const renderedOptions = options.map((option) => {
    let active = "";
    if (value?.label === option.label) {
      active = "is-active ";
    }
    return (
      <div className={`dropdown-item is-size-6 ${styles.selectItem} ${active} `}
        onClick={() => handleOptionClick(option)}
        key={option.value}>
        {option.label}
      </div>
    )
  });

  const icon = <span className="is-size-5">
    {isOpen ? <GoChevronDown /> : <GoChevronLeft />}
  </span>

  return (
    <div ref={divEl} {...rest} className="dropdown is-active" >
      <div className="dropdown-trigger">
        <button type="button" className="button pt-1 pb-0">
          <div
            className={`columns`}
            onClick={() => setIsOpen((current) => !current)}
          >
            <div className="column pt-3 is-size-6">{value?.label || 'Select... '}</div>
            <div className="column is-narrow">{icon}</div>
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-content">
            {renderedOptions}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;