import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { templateStyleSelector } from '~redux/selectors/templateStyleSelector'
import { actions as templateStyleActions } from '~redux/modules/templateStyle'
import SelectItem from '~components/CollapsibleSelector/SelectItem'
import Collapsable from '~components/Collapsable'

const mapStateToProps = (state) => ({
  styles: templateStyleSelector(state),
})

const mapDispatchToProps = {
  ...templateStyleActions,
}

const TemplateStyleSelector = ({
  selectedStyle, onSelect, getStyles, styles, isPostCard,
}) => {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    getStyles()
  }, [])
  useEffect(() => {
    onSelect(null)
  }, [isPostCard])
  const onSelectItem = (item) => {
    onSelect(item);
    setOpen(false);
  }

  return (
    <Collapsable trigger={selectedStyle ? selectedStyle.name : 'Select a Template style'} open={open} setOpenStatus={(flag) => setOpen(flag)}>
      {styles.result
        && styles.result.filter((item) => !!item.get('is_post_card') === !!isPostCard).map((style) => {
          const styleId = style.get('id')
          const name = style.get('name')
          return (
            <SelectItem
              item={name}
              selected={selectedStyle && styleId === selectedStyle.id}
              onSelect={() => onSelectItem(style)}
              key={styleId}
            />
          )
        })}
    </Collapsable>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TemplateStyleSelector)
