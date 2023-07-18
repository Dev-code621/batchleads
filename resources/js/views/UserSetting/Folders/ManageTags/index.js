import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { toast } from '~common/helper'
import {
  tagSelector,
  tagUpdateSelector,
  tagDeleteSelector,
  tagLoadingSelector,
  tagErrorSelector,
} from '~redux/selectors/tagSelector'
import TagRow from './layout/TagRow';
import { actions as tagActions } from '~redux/modules/tag'
import Form from '~common/components/Form'
import FormTitle from '~components/Layout/Dashboard/FormTitle'
import ScrollContainer from '~components/Layout/Dashboard/ScrollContainer'
import ContainerRow from '~components/ContainerRow'
import LoadingActivity from '~components/LoadingActivity'
import './layout/style.scss'

const mapStateToProps = (state) => ({
  tags: tagSelector(state),
  updateResult: tagUpdateSelector(state),
  deleteResult: tagDeleteSelector(state),
  loading: tagLoadingSelector(state),
  tagError: tagErrorSelector(state),
})

const mapDispatchToProps = {
  ...tagActions,
}

const ManageTags = withRouter(
  ({
    getTags,
    tags,
    createTag,
    updateResult,
    deleteResult,
    initTagResult,
    history,
    tagError,
    loading,
  }) => {
    useEffect(() => {
      getTags()
    }, [])

    useEffect(() => {
      if (tagError && tagError.error) {
        toast.error('Same tag already exists.')
      }
    }, [tagError])

    useEffect(() => {
      if (updateResult.success) {
        toast.success('Successfully updated tag.')
        initTagResult()
      }
      if (updateResult.error) {
        toast.error('Same tag already exists.')
        initTagResult()
      }
    }, [updateResult])

    useEffect(() => {
      if (deleteResult.success) {
        toast.success('Successfully deleted tag.')
        initTagResult()
      }
      if (deleteResult.error) {
        toast.error(deleteResult.error.message)
        initTagResult()
      }
    }, [deleteResult])

    const [newTag, setNewTag] = useState([])
    const [editId, setEditId] = useState('')

    const onCreateTag = () => {
      // const newValue = newFolder.length > 0 ? newFolder[newFolder.length - 1] + 1 : 1
      setNewTag([1])
      setEditId(1)
    }


    const saveNewTag = (id, tagName) => {
      if (tagName) {
        createTag(tagName)
        setNewTag([])
      }
    }

    const changeEditMode = (id, status) => {
      if (status) {
        setEditId(id)
        setNewTag([])
      } else {
        setEditId('')
      }
    }

    return (
      <Form className="manage-tag-page">
        <FormTitle
          title="Tag Manager"
          hasAdd
          onAdd={onCreateTag}
          hasBack
          history={history}
        />
        <ScrollContainer>
          {(loading || tags.loading) && (
            <ContainerRow>
              <LoadingActivity />
            </ContainerRow>
          )}
          {newTag && newTag.map((tag) => {
            const tempTag = { name: 'New', id: tag }
            return (
              <TagRow
                item={tempTag}
                key={tempTag.name}
                tags={tags}
                newItem
                hideDelete
                setEdit={tempTag.id === editId}
                onEditMode={changeEditMode}
                onCreateTag={saveNewTag}
              />
            )
          })}
          {tags && tags.map((tag) => {
            const { id } = tag
            return (
              <TagRow
                item={tag}
                key={id}
                tags={tags}
                onEditMode={changeEditMode}
                setEdit={id === editId}
              />
            )
          })}
        </ScrollContainer>
      </Form>
    )
  }
)

export default connect(mapStateToProps, mapDispatchToProps)(ManageTags)
