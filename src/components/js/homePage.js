import { useEffect, useState } from "react";
import md5 from "md5";
import "../css/homePage.css";
import CharacterCard from "./characterCard";
import ReactPaginate from "react-paginate";

export default function HomePage() {
    //API accessing keys 
    const apikey = "6619cffb9b114885434f6a2bbba0e76d";
    const privateKey = "8d554380e787ba5b18deacf21b384ed72c2be5a6";

    let cardsPerPage = 2;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        cardsPerPage = 2; //Two cards per page in mobile screens
    } else {
        cardsPerPage = 3;  //three cards per page in Desktop screens 
    }

    const [data, setData] = useState([]); //holds the API data
    const [search, setSearch] = useState(""); //search string 
    const [sorting, setSorting] = useState(""); //sorting var

    //pagination vars 
    const [pageNumber, setPageNUmber] = useState(0);
    const cardsVisited = pageNumber * cardsPerPage;  
    const pageCount = Math.ceil(data.length / cardsPerPage);

    const searchHandler = (e) => {  
        setSearch(e.target.value.toLowerCase());
    };

    const pageHandler = (page) => {
        setPageNUmber(page);
    };


    //to update data according sorting order 
    useEffect(() => {
        let sortedData = [];
        switch (sorting) {
            case "a-z":
                sortedData = data.sort((a, b) => (a.name > b.name ? 0 : b.name > a.name ? -1 : 1));
                setData(sortedData);
                break;
            case "z-a":
                sortedData = data.sort((a, b) => (a.name < b.name ? 0 : b.name < a.name ? -1 : 1));
                setData(sortedData);
                break;
            default:
                sortedData = data.sort(function (a, b) {
                    return 0.5 - Math.random();
                });
                setData(sortedData);
                break;
        }
        // console.log(sorting);
    }, [sorting, data]);


    //initial fetch on mounting the component 
    useEffect(() => {
        const params = generateHash();
        let url = `https://gateway.marvel.com/v1/public/characters?apikey=${apikey}&hash=${params.hash}&ts=${params.ts}`;
        const fetchData = async function () {
            await fetch(url)
                .then((resp) => resp.json())
                .then((d) => {
                    setData(d.data.results);
                    // console.log(d.data.results);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        fetchData();
    }, []);

    //Hashing generator for Marvel API call 
    const generateHash = () => {
        const d = new Date().getTime().toString();
        return { ts: d, hash: md5(d + privateKey + apikey) };
    };

    //this create all the charcters based on the data fetched 
    const DisplayCards = () => {
        return data
            .filter((item) => {
                return item.name.toLowerCase().includes(search);
            })
            .slice(cardsVisited, cardsVisited + cardsPerPage)
            .map((item) => {
                return <CharacterCard key={item.id} item={item} ></CharacterCard>;
            });
    };

    return (
        <div className="homePage">
            <div className="logo"></div>
            <div className="searchBox">
                <input
                    type="text"
                    defaultValue=""
                    placeholder="Search Character"
                    onChange={(e) => {
                        searchHandler(e);
                    }}
                ></input>

                <select
                    defaultValue=""
                    onChange={(e) => {
                        e.preventDefault();
                        setSorting(e.target.value);
                    }}
                >
                    <option value="Chose-Order">Chose Order</option>
                    <option value="a-z">a-z</option>
                    <option value="z-a">z-a</option>
                </select>
            </div>
            <div className="character-grid">
                <DisplayCards></DisplayCards>
            </div>
            <ReactPaginate previousLabel={"< pre"} nextLabel={"next >"} pageCount={pageCount} onPageChange={(e) => pageHandler(e.selected)} containerClassName={"pagination"} previousLinkClassName={"previousPage"} nextLinkClassName={"nextPage"} activeClassName={"currentPage"}></ReactPaginate>
        </div>
    );
}
