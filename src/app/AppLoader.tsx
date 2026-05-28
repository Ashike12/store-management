import './AppLoader.css';

const AppLoader = () => {
  return (
    <div className="boot-loader boot-loader--admin" role="status" aria-live="polite" aria-label="Loading app">
      <div className="ring-loader" aria-hidden="true">
        <span className="ring-loader__outer" />
        <span className="ring-loader__inner" />
      </div>
    </div>
  );
};

export default AppLoader;
