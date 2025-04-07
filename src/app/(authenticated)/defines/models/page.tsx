"use client"

import { useLanguage } from '@/i18n'
import { ListGrid } from '@/components/ui216/list-grid'
import { TableCell, TableHead } from '@/components/ui/table'
import { TsnSelectRemote } from '@/components/ui216/tsn-select-remote'
export default function DatabasesPage() {
  const { t } = useLanguage()
  return (
    <ListGrid
      apiPath='/db/models'
      options={{ type: 'Update' }}
      title={t('Models')}
      onHeaderPaint={() => {
        return (<>
          <TableHead>{t('Name')}</TableHead>
          <TableHead>{t('Article')}</TableHead>
        </>)
      }}
      onRowPaint={(e, index) => {
        return (<>
          <TableCell className='flex flex-col'>
            <span className='font-bold'>{e.name}</span>
            <span className='text-[80%]'>{e.category?.name}</span>
          </TableCell>
          <TableCell className=''>{e.article}</TableCell>
        </>)
      }}
      onFilterPanel={(filter, setFilter) => {
        return (
          <TsnSelectRemote
            title={t('Category')}
            defaultValue={filter.category}
            apiPath='/db/categories'
            onValueChange={e => setFilter({ ...filter, category: e })}
            all
          />
        )
      }}
    />
  )
}

