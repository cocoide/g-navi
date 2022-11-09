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
                <input className="w-full h-10 p-3 m-1 bg-transparent text-center rounded-sm
               shadow-none ring-9"
                    type="search" name="seachWord" placeholder="キーワードを入力" >



                </input>
                <button className='my-1 mr-1'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59" />
                    </svg>

                </button>
            </form>
        </>
    )
}