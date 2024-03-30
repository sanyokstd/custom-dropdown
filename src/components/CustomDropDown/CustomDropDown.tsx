import React, { useState, useRef, useEffect, ChangeEvent, useCallback } from 'react';
import './CustomDropDown.style.css';

export interface Option {
  value: string;
  label: string;
}

interface Props {
  options: Option[];
  onSelect: (option: Option) => void;
  searchFunction?: (searchTerm: string) => Promise<Option[]>;
  customRenderer?: (option: Option) => React.ReactNode;
  className?: string;
}

const CustomDropdown: React.FC<Props> = ({ options, onSelect, customRenderer, searchFunction, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Option | null>(null);
  const [filteredOptions, setFilteredOptions] = useState<Option[]>(options);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const mouseDownRef = useRef(false);

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropDown = () => {
    mouseDownRef.current = false;
    setIsOpen((prev) => !prev);
  };

  const handleFocus = () => {
    if (!mouseDownRef.current) {
      setIsOpen(true);
    }
  };

  const handleMouseDown = () => {
    mouseDownRef.current = true;
  };

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onSelect) {
      onSelect(option);
    }
  };

  const handleSearchChange = useCallback(
    async (searchTerm: string) => {
      if (!searchTerm) {
        setFilteredOptions(options);
        return;
      }

      if (searchFunction) {
        setIsFetching(true);
        const results = await searchFunction(searchTerm);
        setFilteredOptions(results);
        setIsFetching(false);
      } else {
        const filtered = options.filter((option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()));
        setFilteredOptions(filtered);
      }
    },
    [searchFunction, options],
  );

  useEffect(() => {
    handleSearchChange(searchValue);
  }, [handleSearchChange, searchValue]);

  return (
    <div
      ref={dropdownRef}
      className={`custom-dropdown ${isOpen ? 'custom-dropdown-open' : ''} ${className ? className : ''}`}
    >
      <div
        className="selected-option"
        tabIndex={0}
        onFocus={handleFocus}
        onClick={toggleDropDown}
        onMouseDown={handleMouseDown}
      >
        {selectedOption
          ? customRenderer
            ? customRenderer(selectedOption)
            : selectedOption.label
          : 'Оберіть ваше місто'}
      </div>
      {isOpen && (
        <div className="dropdown-options">
          <div className="dropdown-search">
            <input
              value={searchValue}
              className="dropdown-input"
              type="text"
              placeholder="Пошук..."
              onChange={handleSearch}
            />
          </div>
          {isFetching ? (
            <div className="dropdown-text">Пошук...</div>
          ) : (
            <>
              {filteredOptions.length > 0 ? (
                <ul className="dropdown-list">
                  {filteredOptions.map((option) => (
                    <li
                      tabIndex={0}
                      className="dropdown-item"
                      key={option.value}
                      onClick={() => handleOptionClick(option)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleOptionClick(option);
                        }
                      }}
                    >
                      {customRenderer ? customRenderer(option) : option.label}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="dropdown-text">Нічого не знайдено</div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
