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
  const { displayText, text } = props;

  return (
    <div>
      {displayText}
      <CopyToClipboardButton text={text} />
    </div>
  );
}

export default CopyToClipboardButton;