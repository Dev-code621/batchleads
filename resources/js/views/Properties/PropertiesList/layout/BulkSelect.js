import React from 'react'
import Button from '~components/Button'

export default ({
  showOption,
  showOptionMenu,
  count,
  total,
  visible,
  isSelectedAll,
  onSelectAll,
  onUnselectAll,
  onSelectVisible,
  // onSelectCustomNumber,
}) => {
  // const [customNumber, setCustomNumber] = useState(undefined);


  const onSelectAllItems = () => {
    if (!isSelectedAll && total !== count) {
      onSelectAll()
    }
  }

  const onUnselectAllItems = () => {
    onUnselectAll()
  }

  const onSelectVisibleItems = () => {
    onSelectVisible()
  }

  // const onCustomNumberChange = (e) => {
  //   setCustomNumber(e.target.value)
  // }

  // const onSelectCustomNumberItems = () => {
  //   onSelectCustomNumber(customNumber)
  // }

  // const maxLengthCheck = (object) => {
  //   if (object.target.value.length > object.target.maxLength) {
  //     object.target.value = object.target.value.slice(0, object.target.maxLength)
  //   }
  // }

  return (
    <div
      className="bulk-selector"
    >
      <Button
        label={`SELECT ${count ? `(${count})` : ''}`}
        height="40px"
        width="100%"
        color={count ? 'blue' : 'gray'}
        onClick={showOptionMenu}
        style={{
          fontSize: '14px',
        }}
      />
      {
        showOption && (
          <div className="options-container">
            <div className={`option ${!total ? 'disabled' : ''} ${isSelectedAll && total === count ? 'active' : ''}`} onClick={onSelectAllItems}>
              Select all
              {total ? ` (${total})` : ''}
            </div>
            <div className={`option ${!total ? 'disabled' : ''} ${visible && count === visible ? 'active' : ''}`} onClick={onSelectVisibleItems}>
              Select Visible
              {visible ? ` (${visible})` : ''}
            </div>
            <div className={`option ${!count ? 'disabled' : ''}`} onClick={onUnselectAllItems}>Unselect all</div>
            {/* <div className="option option--input">
              <input
                type="number"
                maxLength="6"
                className="option__input"
                value={customNumber}
                placeholder="Custom number"
                onChange={onCustomNumberChange}
                onInput={maxLengthCheck}
              />
              <input type="button" onClick={onSelectCustomNumberItems} />
        </div> */}
          </div>
        )
      }
    </div>
  )
}
