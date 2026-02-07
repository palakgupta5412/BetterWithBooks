import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineArrowRight } from "react-icons/md";
import { FaArrowLeft } from "react-icons/fa";

const booksData = [
  {
    id: 1,
    bookName: "It Ends With Us",
    author: "Colleen Hoover", 
    genre: ["Romance", "Contemporary", "Drama"],
    status: "Finished",
    pagesRead: 376,
    totalPages: 376,
    progressPercent: 100,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81s0B6NYXML.jpg",
  },
  {
    id: 2,
    bookName: "It Starts With Us",
    author: "Colleen Hoover",
    genre: ["Romance", "Contemporary"],
    status: "To be Read",
    pagesRead: 0,
    totalPages: 336,
    progressPercent: 0,
    coverImage: "https://m.media-amazon.com/images/I/81G91BUSHsL._UF1000,1000_QL80_.jpg",
  },
  {
    id: 3,
    bookName: "The Seven Husbands of Evelyn Hugo",
    author: "Taylor Jenkins Reid",
    genre: ["Fiction", "Romance", "Historical"],
    status: "Reading",
    pagesRead: 120,
    totalPages: 400,
    progressPercent: 30,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71KcUgYanhL.jpg",
  },
  {
    id: 4,
    bookName: "Atomic Habits",
    author: "James Clear",
    genre: ["Self-help", "Productivity", "Non-fiction"],
    status: "Finished",
    pagesRead: 320,
    totalPages: 320,
    progressPercent: 100,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/91bYsX41DVL.jpg",
  },
  {
    id: 5,
    bookName: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: ["Fantasy", "Adventure", "Young Adult"],
    status: "Reading",
    pagesRead: 90,
    totalPages: 223,
    progressPercent: 40,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81YOuOGFCJL.jpg",
  },
  {
    id: 6,
    bookName: "The Alchemist",
    author: "Paulo Coelho",
    genre: ["Fiction", "Philosophical", "Adventure"],
    status: "To be Read",
    pagesRead: 0,
    totalPages: 208,
    progressPercent: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/71aFt4+OTOL.jpg",
  },
  {
    id: 7,
    bookName: "A Good Girl's Guide to Murder",
    author: "Holly Jackson",
    genre: ["Mystery", "Thriller", "Young Adult"],
    status: "To be Read",
    pagesRead: 0,
    totalPages: 433,
    progressPercent: 0,
    coverImage: "https://upload.wikimedia.org/wikipedia/en/e/e2/A_Good_Girl%27s_Guide_to_Murder.jpg",
  },
  {
    id: 8,
    bookName: "The Silent Patient",
    author: "Alex Michaelides",
    genre: ["Psychological Thriller", "Mystery"],
    status: "to buy",
    pagesRead: 0,
    totalPages: 336,
    progressPercent: 0,
    coverImage: "https://images-na.ssl-images-amazon.com/images/I/81JJPDNlxSL.jpg",
  },
];

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  return (
    <div className="min-w-[110px] flex flex-col items-center group cursor-pointer">
      
      <p className="opacity-0 group-hover:opacity-100 text-[11px] mt-2 text-center font-medium line-clamp-1 w-[110px]">
        {book.bookName}
      </p>
      <p className="opacity-0 group-hover:opacity-70 text-[10px] mb-1 line-clamp-1">{book.author}</p>
      {book.status === "Reading" && (
        <div className="absolute text-xs opacity-0 group-hover:opacity-100 -top-8 left-1/2 w-2 h-2 rounded-full pr-20 ">{book.progressPercent}% read</div>
      )}
      <div className="w-[90px] h-[120px] rounded-md overflow-hidden shadow-md group-hover:scale-[1.03] transition">
        <img
          onClick={()=>navigate('/explore' , {state: {book}})}
          src={book.coverImage ? book.coverImage : "/aboutImg/3.jpg"}
          alt={book.bookName}
          className="w-full group h-full object-cover"
        />
      </div>

      
    </div>
  );
};

const BookShelf = ({ title, books }) => {
  return (
    <div className="w-full">
      {/* heading */}
      <div className="w-full flex justify-between items-center mb-2">
        <h2 className="font-playfair text-lg font-semibold">{title}</h2>
        <button className="text-xs opacity-70 hover:opacity-100 flex items-center gap-1">
          Full shelf <MdOutlineArrowRight />
        </button>
      </div>

      {/* shelf board + books */}
      <div className="relative w-full">
        {/* Books row */}
        <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-2 scrollbar-hide">
          {books.length === 0 ? (
            <p className="text-sm opacity-60 px-4 py-4">No books here yet ✨</p>
          ) : (
            books.map((b) => <BookCard key={b.id} book={b} />)
          )}
        </div>

        {/* shelf plank */}
        <div className="absolute bottom-3 left-0 w-full h-[12px] bg-[#ffc983f3] rounded-md shadow-inner"></div>
      </div>
    </div>
  );
};

const Tbr = () => {
  const [statusFilter, setStatusFilter] = useState("All Genres");
  const navigate = useNavigate();
  // status wise grouping
  const grouped = useMemo(() => {
    const reading = booksData.filter((b) => b.status === "Reading");
    const tbr = booksData.filter((b) => b.status === "To be Read");
    const finished = booksData.filter((b) => b.status === "Finished");
    const buy = booksData.filter((b) => b.status === "to buy");
    const romance = booksData.filter((b) => b.genre.includes("Romance"));
    const thriller = booksData.filter((b) => b.genre.includes("Thriller"));
    const historical = booksData.filter((b) => b.genre.includes("Historical"));
    const fantasy = booksData.filter((b) => b.genre.includes("Fantasy"));
    const scifi = booksData.filter((b) => b.genre.includes("Science Fiction"));
    const nonfiction = booksData.filter((b) => b.genre.includes("Non-fiction"));
    const selfhelp = booksData.filter((b) => b.genre.includes("Self-help"));
    const mystery = booksData.filter((b) => b.genre.includes("Mystery"));

    return { reading, tbr, finished, buy, romance, thriller, historical, fantasy, scifi, nonfiction, selfhelp, mystery };
  }, []);

  return (
    <div className="text-white w-full min-h-screen flex bg-[url('/tbrBg.png')] bg-cover bg-no-repeat">
      {/* Sidebar */}
      <div className="w-[280px] sticky max-h-screen px-4 bg-transparent border-r flex flex-col pb-6 items-center">
        
        <img src="/logoF.png" alt="Logo" className="w-46 mt-4" />

        <div className="w-full mt-7 flex flex-col gap-1">
          <Link to="/" className="px-4 py-1 rounded-lg hover:bg-black/5">
            Home
          </Link>
          <Link to="/library" className="px-4 py-2 rounded-lg hover:bg-black/5">
            Library
          </Link>
          <Link
            to="/tbr"
            className="px-4 py-2 rounded-lg bg-[#ffba66]/30 font-semibold"
          >
            My Shelves
          </Link>
          <Link to="/quotes" className="px-4 py-2 rounded-lg hover:bg-black/5">
            Quotes
          </Link>
          <Link to="/profile" className="px-4 py-2 rounded-lg hover:bg-black/5">
            Profile
          </Link>
        </div>

        {/* profile mini */}
        <div id="profile" className="cursor-pointer w-full mt-auto flex items-center gap-3 pt-6">
          <img
            src="/aboutImg/1.jpg"
            onClick={()=>navigate('/profile')}
            className="w-12 h-12 rounded-full object-cover"
            alt="Profile"
          />
          <div>
            <p className="hover:underline font-semibold">Palak Sharma</p>
            <p className="hover:underline text-xs opacity-70">@palaksharma</p>
          </div>
        </div>

        <div className="text-xs text-[#ff981a] flex justify-end w-full pr-2 items-center cursor-pointer hover:text-[#ffba66] mt-2">
          View Profile <MdOutlineArrowRight size={20} />
        </div>
      </div>

      {/* Main */}
      <div className="scroll-y-auto h-screen overflow-scroll overflow-x-hidden flex-1 p-6">
        {/* Top controls */}
        <div className="w-full flex justify-between items-center mb-6">
          <div className="flex gap-4 items-center">
            <FaArrowLeft className="text-3xl cursor-pointer" onClick={()=>navigate(-1)}/>
            <div>  
              <h1 className="font-playfair text-3xl font-bold">My Shelves</h1>
              <p className="opacity-70 text-sm">Organize your reads beautifully ✨</p>
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border bg-[url('/tbrBg.png')] border-[#ffba66] text-white text-sm outline-none"
          >
            <option className="bg-black">All Genres</option>
            <option className="bg-black">Romance</option>
            <option className="bg-black">Thriller</option>
            <option className="bg-black">Historical</option>
            <option className="bg-black">Fantasy</option>
            <option className="bg-black">Science Fiction</option>
            <option className="bg-black">Non-fiction</option>
            <option className="bg-black">Self-help</option>
            <option className="bg-black">Mystery</option>
          </select>
        </div>

        {/* Shelves */}
        <div className="w-full bg-transparent rounded-2xl p-6 shadow-sm flex flex-col gap-10">
          {statusFilter === "All Genres" || statusFilter === "Reading" ? (
            <BookShelf title="Currently reading" books={grouped.reading} />
          ) : null}

          {statusFilter === "All Genres" || statusFilter === "To be Read" ? (
            <BookShelf title="Next up" books={grouped.tbr} />
          ) : null}

          {statusFilter === "All Genres" || statusFilter === "Finished" ? (
            <BookShelf title="Finished" books={grouped.finished} />
          ) : null}

          {statusFilter === "All Genres" || statusFilter === "to buy" ? (
            <BookShelf title="Wishlist / To buy" books={grouped.buy} />
          ) : null}

          {statusFilter === "Romance" ? (
            <BookShelf title="Romance" books={grouped.romance} />
          ) : null}

          {statusFilter === "Thriller" ? (
            <BookShelf title="Thriller" books={grouped.thriller} />
          ) : null}

          {statusFilter === "Historical" ? (
            <BookShelf title="Historical" books={grouped.historical} />
          ) : null}

          {statusFilter === "Fantasy" ? (
            <BookShelf title="Fantasy" books={grouped.fantasy} />
          ) : null}

          {statusFilter === "Science Fiction" ? (
            <BookShelf title="Science Fiction" books={grouped.scifi} />
          ) : null}

          {statusFilter === "Non-fiction" ? (
            <BookShelf title="Non-fiction" books={grouped.nonfiction} />
          ) : null}

          {statusFilter === "Self-help" ? (
            <BookShelf title="Self-help" books={grouped.selfhelp} />
          ) : null}

          {statusFilter === "Mystery" ? (
            <BookShelf title="Mystery" books={grouped.mystery} />
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default Tbr;
