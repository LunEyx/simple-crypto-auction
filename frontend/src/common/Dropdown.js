import Dropdown from 'react-multilevel-dropdown';

export const createDropdownItems = (data, fn) => {
    const result = [];
    for (const [key, value] of Object.entries(data)) {
      let onClickFn = () => {};
      const isValueObject = typeof value === 'object';
      if (!isValueObject) {
        onClickFn = fn;
      }
      const item = (
        <Dropdown.Item key={key} onClick={() => onClickFn(key, value)}>
          {key}
          {isValueObject ? (
            <Dropdown.Submenu position='right'>
              {createDropdownItems(value, fn)}
            </Dropdown.Submenu>
          ) : null}
        </Dropdown.Item>
      );
      result.push(item);
    }
    return result;
  };