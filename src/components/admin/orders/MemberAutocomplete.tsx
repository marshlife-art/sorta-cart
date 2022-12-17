import React, { useState, useEffect } from 'react'

import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import CircularProgress from '@material-ui/core/CircularProgress'

import { useMembersAutocomplete } from '../../../services/hooks/members'
import { MemberOption } from '../../../services/fetchers/types'

interface MemberAutocompleteProps {
  onItemSelected: (value: MemberOption) => void
}

export default function MemberAutocomplete(props: MemberAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<MemberOption[]>([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)

  const { members, isError, isLoading } = useMembersAutocomplete(q)

  useEffect(() => {
    if (!members) {
      return
    }
    setOptions(members)
    setLoading(false)
  }, [members])

  useEffect(() => {
    if (isError) {
      setOptions([])
    }
    setLoading(isLoading)
  }, [isError, isLoading])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  function onInputChnage(value: string) {
    if (value && value.length > 0) {
      setQ(value)
      setLoading(true)
    }
  }

  return (
    <Autocomplete
      id="add-line-item-autocomplete"
      style={{ width: '100%' }}
      open={open}
      onOpen={() => {
        setOpen(true)
      }}
      onClose={() => {
        setOpen(false)
      }}
      getOptionSelected={(option, value) => option.name === value.name}
      getOptionLabel={(option) => option.name}
      onChange={(event, value) =>
        value && typeof value !== 'string' && props.onItemSelected(value)
      }
      options={options}
      loading={loading}
      freeSolo
      renderInput={(params) => (
        <TextField
          {...params}
          label="Member search"
          fullWidth
          autoFocus
          variant="outlined"
          value={q}
          onChange={(event) => onInputChnage(event.target.value)}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            )
          }}
        />
      )}
    />
  )
}
