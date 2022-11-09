import { FC, RefObject, SyntheticEvent, useRef } from 'react'
import { useUserFormMutator } from '../infrastructure/recoil/UserFormState'
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
            <form ref={formRef} onSubmit={handlerOnSubmitSearch} className="flex flex-raw justify-center bg-slate-200 mx-20 drop-shadow-md  outline outline-1 outline-slate-300">
                <input className="w-full h-10 p-3 m-1 bg-transparent text-center rounded-sm"
                    type="search" name="seachWord" placeholder="キーワードを入力" />
                <button className='my-1 mr-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"
                        className="w-8 h-8 bg-white text-slate-500 rounded-md">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM10.5 7.5v6m3-3h-6" />
                    </svg>

                </button>
            </form>
        </>
    )
}