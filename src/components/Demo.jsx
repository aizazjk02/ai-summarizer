import { useEffect, useState } from "react";
import { copy, linkIcon, loader, tick } from "../assets";
import { useLazyGetSummaryQuery } from "../services/article";

function Demo() {
  // custom hook generated from createAPI 
  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();
  
  // State to store current article 
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });

  // State to historic data 
  const [allArticles, setAllArticles] = useState([]);

  // State to handle copy url 
  const [copiedUrl, setCopiedUrl] = useState("")

  // Function to handle submit 
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Fetch article summary from api endpoint 
    const { data } = await getSummary({
      articleUrl: article.url,
    });

    // Handle Data 
    if (data?.summary) {
      const newArticle = { ...article, summary: data.summary };
      const updatedAllArticles = [newArticle, ...allArticles];

      setArticle(newArticle);
      setAllArticles(updatedAllArticles);
      localStorage.setItem("articles", JSON.stringify(updatedAllArticles));
      
    }
  };

  // Function to handle copy button
  const handleCopy = (copyUrl) => {
        setCopiedUrl(copyUrl)
        navigator.clipboard.writeText(copyUrl)
        setTimeout(() => setCopiedUrl(""), 3000)

  }

  // handle data fetching from localstorage 
  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem("articles")
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  return (
    <section className="mt-16 w-full max-w-xl">
      {
        // Search
      }
      <div className="flex flex-col w-full gap-2">
        <form
          action=""
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
        >
          <img
            src={linkIcon}
            alt="link_icon"
            className="absolute left-0 my-2 ml-3 w-5"
          />
          <input
            className="url_input peer"
            type="url"
            name=""
            id=""
            placeholder="enter a URL"
            value={article.url}
            onChange={(e) => {
              setArticle({
                ...article,
                url: e.target.value,
              });
            }}
            required
          />
          <button
            type="submit"
            className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
          >
            ↲
          </button>
        </form>
        {
          // url history
        }
        <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
          {allArticles?.map((item, index) => (
            <div
              key={`link-${index}`}
              onClick={() => setArticle(item)}
              className="link_card"
            >
              <div className="copy_btn " onClick={() => handleCopy(item.url)}>
                <img
                  src={copiedUrl === item.url ? tick : copy}
                  alt="copy_icon"
                  className="w-[40%] h-[40%] object-contain"
                />
              </div>
              <p className="flex-1 font-satoshi text-blue-700 font-medium text-sm truncate">
                {item.url}
              </p>
            </div>
          ))}
        </div>
      </div>
      {
        // display results
      }
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching? (
            <img src={loader} alt="loader" className="w-20 h-20 object-contain "/>
        ) : error ? (
            <p className="font-inter font-bold text-black text-center">
                OOPS! Something went wrong...
                <br/>
                <span className="font-satoshi font-normal text-gray-700">
                    {error?.data?.error}
                </span>
            </p>
        ) : (
            article.summary && (
                <div className="flex flex-col gap-3">
                    <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                        Article <span className="blue_gradient">Summary</span>

                    </h2>
                    <div className="summary_box">
                        <p className="font-inter font-medium text-sm text-gray-700">{article.summary}</p>
                    </div>
                </div>
            )
        )}
      </div>
    </section>
  );
}

export default Demo;
