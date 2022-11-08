import React, { FC, RefObject, SyntheticEvent, useRef } from 'react'
import { useUserFormMutator } from '../infrastructure/UserFormState'
import { useShopDataSWR } from '../infrastructure/UseShopDataSRW'
import { fetcher } from '../libs/fetcher'



interface SearchFormProps {
    userSetKeyword: string
    fallbackData: HotpepperResponseType
}
/**
 * @description 検索フォームコンポーネント
 * useSWR で制御しているデータを更新する。
 */
export const SearchForm: FC<SearchFormProps> = ({ userSetKeyword, fallbackData }) => {
    const { setSearchWord } = useUserFormMutator()

    const { mutate } = useShopDataSWR(userSetKeyword, fallbackData)

    const formRef: RefObject<HTMLFormElement> = useRef<HTMLFormElement>(null)

    const handlerOnSubmitSearch = async (e: SyntheticEvent): Promise<void> => {
        e.preventDefault()

        const target = e.target as typeof e.target & {
            seachWord: { value: string }
        }

        // ユーザーが入力したキーワード
        const seachWordValue: string = target.seachWord.value

        // RecoilのsetState
        setSearchWord(seachWordValue)

        // バウンドミューテーション
        // フォームに同一キーワードが入っている状態でclickボタンを複数押下したときに、
        // 厳密にデータが最新か検証を行う場合は必要。
        const mutationData = await fetcher(`api/gourmet/${seachWordValue}`)

        mutate(mutationData).catch((error) => {
            throw error
        })
    }

    return (
        <>
            <form ref={formRef} onSubmit={handlerOnSubmitSearch} className="flex flex-col justify-center">
                <input className="h-10 p-3 mx-10"
                    type="search" name="seachWord" placeholder="キーワードを入力して下さい" />
                <button>SEARCH</button>
            </form>
        </>
    )
}