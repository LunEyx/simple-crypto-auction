import { AiOutlineCopy } from 'react-icons/ai';

const copyToClipboard = (text) => {
  const el = document.createElement('textarea');
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

const CopyToClipboardButton = (props) => {
  const { text } = props;

  return <AiOutlineCopy onClick={() => copyToClipboard(text)} />
};

export const CellWithCopy = (props) => {
  const { row, name } = props;
  let displayText = row[name];
  if (displayText.length > 17 && displayText.substring(0, 2) === '0x') {
    displayText = row[name].substring(0, 8) + '...' + row[name].slice(-6);
  }

  return (
    <div>
      {displayText}
      <CopyToClipboardButton text={row[name]} />
    </div>
  );
}

export default CopyToClipboardButton;