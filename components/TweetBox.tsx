import { useState, useRef, MouseEvent, Dispatch, SetStateAction } from 'react'
import { CalendarIcon, EmojiHappyIcon, LocationMarkerIcon, PhotographIcon, LinkIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { Tweet, TweetBody } from '../typings'
import { fetchTweets } from '../utils/fetchTweets'
import toast from 'react-hot-toast'
interface Props  {
  setTweets: Dispatch<SetStateAction<Tweet[]>>
}

const TweetBox = ({  setTweets }: Props) => {
  const [tweet, setTweet] = useState<string>('') 
  const [image, setImage] = useState<string>('')
  const imageInputRef = useRef<HTMLInputElement>(null)
  const { data: session } = useSession();
  const [ imageUrlBoxIsOpen, setImageUrlBoxIsOpen ] = useState<boolean>(false);
  const filePickerRef = useRef<HTMLInputElement>(null);


  const addImageToTweet = (e: React.MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) => {
    e.preventDefault();
    if (!imageInputRef.current?.value) return;
    setImage(imageInputRef.current.value)
    imageInputRef.current.value = '';
    setImageUrlBoxIsOpen(false)
  }
  const addImgToTweet = (e:any) => {
    const reader = new FileReader();
    if (e.target.files[0]) {
    reader.readAsDataURL(e.target.files[0]);
    }
    reader.onload = (readerEvent:any) => {
      setImage(readerEvent.target.result);
    };
  }
  const postTweet = async () => {
    const tweetBody: TweetBody = {
      text: tweet,
      username: session?.user?.name || 'unknown User',
      profileImg: session?.user?.image || 'https://links.papareact.com/gll',
      image: image,
    }
    
    const result= await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetBody),
      method: 'POST'
    })
    const json = await result.json();
    const newTweets = await fetchTweets()
    setTweets(newTweets)
    toast('Tweet Posted')
    return json
  }
  const handleSubmit=(e: MouseEvent<HTMLButtonElement,globalThis.MouseEvent>) =>{
    e.preventDefault()
    postTweet()

    setTweet('');
    setImage('')
    setImageUrlBoxIsOpen(false)
  }
  let userImage = session?.user?.image
  
  return (
    <div className='flex gap-2 px-5'>
        <img src={userImage || 'https://pbs.twimg.com/profile_images/1549328709215260673/dcm5WbTX_400x400.jpg'} className="mt-4 h-14 w-14 rounded-full object-cover" alt="profile logo"/>
        <div className='flex flex-1 items-center pl-2'>
          <form className='flex flex-col flex-1'>
            <input type="text" value={tweet} onChange={(e)=>setTweet(e.target.value)} placeholder="What's Happening" className='h-24 w-full text-xl outline-none bg-transparent'/>
            
            <div className='flex justify-between items-center'>
              {/* icons */}
              <div className='flex gap-2 text-twitter'>
                <LinkIcon onClick={()=> setImageUrlBoxIsOpen(!imageUrlBoxIsOpen)} className='w-5 h-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150'/>
                <PhotographIcon onClick={() => filePickerRef?.current?.click()} className='w-5 h-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150'/>
                <input type="file" ref={filePickerRef} hidden onChange={addImgToTweet} />
                <EmojiHappyIcon className='w-5 h-5'/>
                <CalendarIcon className='w-5 h-5'/>
                <LocationMarkerIcon className='w-5 h-5'/>
              </div>
              {/* tweet button */}
              <button disabled={!tweet.trim() || !session} className='disabled:opacity-40 bg-twitter py-2 px-5 font-bold text-white rounded-full' onClick={handleSubmit}>Tweet</button>
            </div>
            {imageUrlBoxIsOpen && (
              <form  className='mt-5 flex rounded-lg bg-twitter/80 py-2 px-4'>
                <input ref={imageInputRef}  type="text" placeholder='Enter Imgae url...' className='flex-1 bg-transparent p-2 text-white outline-none placeholder:text-white'  />
                <button className='font-bold text-white' onClick={addImageToTweet}>Add Image</button>
              </form>
            )}
            {image && (
              <img className='mt-10 h-40 w-full rounded-xl object-contain shadow-lg' src={image} alt="" />
            )}
          </form>
        </div>
    </div>
  )
}

export default TweetBox