import { useState } from "react";
import "../css/characterCard.css";

export default function CharacterCard(props) {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <div>
            <div
                className="characterCard"
                onClick={(e) => {
                    e.preventDefault();
                    setShowDetails(true);
                }}
            >
                <img src={`${props.item.thumbnail.path}.jpg`} alt={"character"} />
                <div className="border"></div>
                <div className="name">{props.item.name}</div>
            </div>
            <div className={showDetails ? "detailsCard" : "detailsCard showDetails"}>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDetails(false);
                    }}
                >
                    x
                </button>

                <div>{props.item.name}</div>
                <hr></hr>
                <div>
                    Comics&nbsp;<span>{props.item.comics.available}</span>
                </div>
                <div>
                    Events&nbsp;<span>{props.item.events.available}</span>
                </div>
                <div>
                    Series&nbsp;<span>{props.item.series.available}</span>
                </div>
                <div>
                    Stories&nbsp;<span>{props.item.stories.available}</span>
                </div>
                <hr></hr>
                <div className="description">{props.item.description}</div>
            </div>
        </div>
    );
}
