"use client"

import { useEffect, useState } from 'react'
import { getItem } from '@/lib/fetch'
import Cookies from 'js-cookie'
import { getUnitCodeList, InvoiceLine } from '@/types/Invoice'
import { useToast } from '@/components/ui/use-toast'
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { ButtonCancel, ButtonOK } from '@/components/icon-buttons'
import { CheckIcon, XIcon } from 'lucide-react'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
import { useLanguage } from '@/i18n'
import { TsnInput } from '@/components/ui216/tsn-input'
import { TsnSwitch } from '@/components/ui216/tsn-switch'
import { Item } from '@/types/Item'
import { moneyFormat } from '@/lib/utils'
// import {
//   Tabs,
//   TabsContent,
//   TabsList,
//   TabsTrigger,
// } from "@/components/ui/tabs"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { TsnSelect } from '@/components/ui216/tsn-select'

interface Props {
  trigger?: any
  defaultValue?: InvoiceLine
  onChange?: (e: InvoiceLine) => void
  title?: any
  description?: any
}
export function InvoiceLinePopup({
  trigger, defaultValue, onChange, title, description
}: Props) {
  const [invoiceLine, setInvoiceLine] = useState<InvoiceLine>(defaultValue || {

  })
  const [quantity, setQuantity] = useState(defaultValue?.invoicedQuantity || 0)
  const [price, setPrice] = useState(defaultValue?.price || 0)
  const [total, setTotal] = useState(defaultValue?.lineExtensionAmount || 0)
  const [vatRate, setVatRate] = useState(0)
  const [vatAmount, setVatAmount] = useState(0)
  const { toast } = useToast()
  const { t } = useLanguage()
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)



  useEffect(() => { !token && setToken(Cookies.get('token') || '') }, [])
  return (<>
    <Sheet>
      <SheetTrigger asChild className='cursor-pointer'>
        {trigger}
      </SheetTrigger>

      <SheetContent className=''>
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <div className='flex flex-col gap-2'>
          <div className='grid grid-cols-3 gap-2'>
            <TsnSelectRemote
              className='col-span-2'
              apiPath='/db/items'
              title={t('Item')}
              defaultValue={invoiceLine.item?._id}
              onValueChange={e => {
                getItem(`/db/items/${e}`, token)
                  .then((result: Item) => {
                    setInvoiceLine({
                      ...invoiceLine,
                      item: { ...invoiceLine.item, _id: e },
                      taxTotal: result.taxType?.taxTotal,
                      withholdingTaxTotal: result.taxType?.withholdingTaxTotal,
                    })
                  })
                  .catch(err => toast({ title: t('Error'), description: t(err || ''), variant: 'destructive' }))
                // .finally(() => setLoading(false))
                // console.log(`e:`, e)

              }}
            />
            <TsnSelect title={t('Unit')}
              list={getUnitCodeList(t)}
            />
          </div>
          <div className='grid grid-cols-3 gap-2'>
            <TsnInput className='text-end' inputClassName='text-end' id='txtQuantity' type={'number'} title={t('Quantity')} defaultValue={quantity}

              onFocus={e => {
                setQuantity(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
                e.target.select()
              }}
              onBlur={e => {
                if (e.target.value != quantity.toString()) {
                  const q = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
                  setQuantity(q)
                  const t = Math.round(100 * price * q) / 100
                  const txtTotal = document.getElementById('txtTotal') as HTMLInputElement
                  setTotal(t)
                  txtTotal.value = t.toString()
                }
              }}
            />
            <TsnInput className='text-end' inputClassName='text-end' id='txtPrice' type={'number'} title={t('Price')} defaultValue={price}
              onFocus={e => {
                setPrice(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
                e.target.select()
              }}
              onBlur={e => {
                if (e.target.value != price.toString()) {
                  const p = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
                  setPrice(p)
                  const t = Math.round(100 * p * quantity) / 100
                  const txtTotal = document.getElementById('txtTotal') as HTMLInputElement
                  setTotal(t)
                  txtTotal.value = t.toString()
                }
              }}
            />

            <TsnInput className='text-end' inputClassName='text-end' id='txtTotal' type={'number'} title={t('Total')} defaultValue={total}
              onFocus={e => {
                setTotal(isNaN(Number(e.target.value)) ? 0 : Number(e.target.value))
                e.target.select()
              }}
              onBlur={async e => {
                if (e.target.value != total.toString()) {
                  const t = isNaN(Number(e.target.value)) ? 0 : Number(e.target.value)
                  setTotal(t)
                  const p = quantity > 0 ? Math.round(10000 * t / quantity) / 10000 : 0
                  const txtPrice = document.getElementById('txtPrice') as HTMLInputElement
                  setPrice(p)
                  txtPrice.value = p.toString()
                }
              }}
            />
          </div>
          <TsnInput title={t('Description')} defaultValue={invoiceLine.note?.join('\n')} onBlur={e => setInvoiceLine({ ...invoiceLine, note: e.target.value.split('\n') })} />
        </div>
        <SheetFooter className='flex justify-end items-center gap-4 mt-4'>
          <div className='flex justify-start'>
          </div>
          <div className='flex flex-row justify-end items-center gap-4'>
            <SheetClose onClick={e => {
              if (!invoiceLine.item) {
                e.preventDefault()
                toast({ title: t('Item required'), variant: 'destructive' })
                return
              }
              onChange && onChange({ ...invoiceLine, invoicedQuantity: quantity, price: price, lineExtensionAmount: total })
            }}><Button size={'icon'}><CheckIcon /></Button></SheetClose>
            <SheetClose className='mt-0'><Button size={'icon'} variant={'secondary'}><XIcon /></Button></SheetClose >
          </div>

        </SheetFooter>
      </SheetContent>
    </Sheet>
  </>)
}