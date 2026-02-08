import React from 'react'
import { FaArrowCircleLeft, FaArrowLeft } from 'react-icons/fa'
import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'
import MyQuotes from '../components/MyQuotes'

const Quotes = () => {
    const navigate = useNavigate();

    
  return (
    <div className='w-full min-h-screen bg-[#1e1701] relative flex flex-col justify-center items-center gap-10 px-10 text-center text-[#D8CFC4] font-gravitas text-2xl'>
        <div className='flex w-full justify-between absolute top-10 px-10'>
            <div>
                <FaArrowLeft  onClick={()=>navigate(-1)}/>
            </div>
            <div className='flex gap-4'>
                <Button text="Create Quote" onClick={()=>{navigate('/createquote')}} className="text-sm" />
                <Button text="All Quotes" onClick={()=>{navigate('/myquotes')}} className="text-sm" />
                {/* <Button text="My Quotes" onClick={()=>{}} className="text-sm" /> */}
            </div>
        </div>

        <MyQuotes />
    </div>
  )
}

export default Quotes