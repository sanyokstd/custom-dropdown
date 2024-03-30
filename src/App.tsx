import './App.css';
import CustomDropdown from './components/CustomDropDown/CustomDropDown';
import { Option } from './components/CustomDropDown/CustomDropDown';

function App() {
  const options = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ];

  const simulateSearch = (query: string): Promise<Option[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const results = options.filter((option) => option.label.toLowerCase().includes(query.toLowerCase()));
        resolve(results);
      }, 1000);
    });
  };

  const customRenderer = (option: Option) => {
    return (
      <div>
        <b>{option.label}</b>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="flex">
        <div className="flex-item">
          <div>Простий варіант</div>
          <br />
          <CustomDropdown options={options} onSelect={(option) => console.log('Selected:', option)} />
        </div>
        <div className="flex-item">
          <div>Асинхроний пошук</div>
          <br />
          <CustomDropdown
            options={options}
            onSelect={(option) => console.log('Selected:', option)}
            searchFunction={async (query) => {
              return await simulateSearch(query);
            }}
          />
        </div>
        <div className="flex-item">
          <div>Кастомізація стилів та елементів списку</div>
          <br />
          <CustomDropdown
            className="custom-class"
            options={options}
            onSelect={(option) => console.log('Selected:', option)}
            customRenderer={customRenderer}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
