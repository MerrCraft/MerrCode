import './tutorial.css';
export const TModal = props => (
    <div>
        <div className="THeader"></div>
        <div className="TContent">{props.children}</div>
    </div>
);
