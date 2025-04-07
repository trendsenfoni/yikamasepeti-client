"use client"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ReactNode, useEffect } from 'react'
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import * as SelectPrimitive from "@radix-ui/react-select"

export interface TsnListType {
  _id?: string
  text?: any
  name?: any
}
export interface TsnSelectProps extends SelectPrimitive.SelectProps {
  title?: any
  all?: boolean
  list?: TsnListType[]
  onValueChange?: (e: string, text?: string) => void
  className?: string
  autoFocus?: boolean
}
export function TsnSelect({ all, list, title, onValueChange, autoFocus, ...props }: TsnSelectProps) {
  useEffect(() => {
    if (props.defaultValue && list) {
      const findex = list.findIndex(e => e._id == props.defaultValue)
      const text = findex > -1 ? list[findex].text : ''
      onValueChange && onValueChange(props.defaultValue || '', text)
    }
    // if (props.defaultValue) {
    //   onValueChange && onValueChange(props.defaultValue || '')
    // }
  }, [])

  return (<div className={`flex flex-col gap-1 my-1 w-full min-w-24 ${props.className}`} >
    <Label className='ms-2'>{title}</Label>
    <Select

      // onValueChange={onValueChange}
      onValueChange={val => {
        if (onValueChange) {
          const text = (list || []).find(e => e._id == val)?.text || (list || []).find(e => e._id == val)?.name || ''
          onValueChange(val, text)
        }
      }}
      {...props}
    >
      <SelectTrigger className="w-full" autoFocus={autoFocus} suppressHydrationWarning>
        {!all && <SelectValue placeholder="---" />}
        {all && <SelectValue placeholder="*" />}
      </SelectTrigger>
      <SelectContent className='w-fu11ll min-w1-22'>
        {all &&
          <SelectGroup>
            <SelectItem value=" ">*</SelectItem>
          </SelectGroup>
        }
        <SelectGroup>
          {list && list.map((e, index) => (e._id && <SelectItem key={e._id} value={e._id}>{e.text || e.name}</SelectItem>))}
        </SelectGroup>
      </SelectContent>
    </Select>
  </div>)
}
