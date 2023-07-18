import React, { Fragment, useState } from 'react'
import CancelModel from './layout/CancelModel'
import PauseModel from './layout/PauseModel'
import CancelConfirm from './layout/CancelConfirm'
import LoadingView from '~components/LoadingView'

import './layout/style.scss'

export default ({
  toggle,
  onClose,
  preventClose,
  loading,
  actionCancel,
  actionPause,
}) => {
  const [page, selectPage] = useState('cancel')
  const [selected, changeSelection] = useState(undefined)
  const [cancelText, changeCancelText] = useState('')
  const [selectedText, setSelectedText] = useState('')

  const onSelected = (selectedId, status) => {
    if (selected !== selectedId && status) {
      changeSelection(selectedId)
      changeCancelText('')
    }
    if (selected === selectedId && !status) {
      changeSelection(undefined)
      setSelectedText('')
    }
  }

  const textUpdate = (e, text) => {
    if (e) {
      changeCancelText(e.target.value)
    }
    setSelectedText(text)
  }

  const optionSelected = (nextPage) => {
    selectPage(nextPage)
  }

  const getText = () => {
    return selectedText.concat(' - ', cancelText);
  }

  const onPauseSelect = () => {
    actionPause(selected, getText())
  }

  const onCancelSelect = () => {
    actionCancel(selected, getText())
  }

  const setKnowMore = (value) => {
    changeCancelText(value ? 'YES' : 'NO')
  }

  return (
    <Fragment>
      {loading ? <LoadingView /> : page
      && ((page === 'cancel'
        && (
          <CancelModel
            onClose={() => (!preventClose || !loading) && onClose()}
            modalAction={optionSelected}
            toggle={toggle}
            onSelect={onSelected}
            textUpdate={textUpdate}
            selected={selected}
            cancelText={cancelText}
            knowMore={setKnowMore}
          />
        )) || (page === 'pause'
        && (
          <PauseModel
            onClose={() => (!preventClose || !loading) && onClose()}
            modalAction={optionSelected}
            toggle={toggle}
            onPause={onPauseSelect}
          />
        )) || (page === 'confirm'
        && (
          <CancelConfirm
            onClose={() => (!preventClose || !loading) && onClose()}
            modalAction={optionSelected}
            toggle={toggle}
            onCancel={onCancelSelect}
          />
        )))
      }
    </Fragment>
  )
}
