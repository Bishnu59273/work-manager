import ContentLoader from "react-content-loader";

const TableSkeleton = () => {
  return (
    <table className="table text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Username</th>
          <th>Email</th>
          <th>Role</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({ length: 5 }).map((_, index) => (
          <tr key={index}>
            <td>
              <ContentLoader
                speed={1}
                width={50}
                height={20}
                viewBox="0 0 50 20"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="3" ry="3" width="50" height="20" />
              </ContentLoader>
            </td>
            <td>
              <ContentLoader
                speed={1}
                width={100}
                height={20}
                viewBox="0 0 100 20"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="3" ry="3" width="100" height="20" />
              </ContentLoader>
            </td>
            <td>
              <ContentLoader
                speed={1}
                width={150}
                height={20}
                viewBox="0 0 150 20"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="3" ry="3" width="150" height="20" />
              </ContentLoader>
            </td>
            <td>
              <ContentLoader
                speed={1}
                width={80}
                height={20}
                viewBox="0 0 80 20"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
              >
                <rect x="0" y="0" rx="3" ry="3" width="80" height="20" />
              </ContentLoader>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TableSkeleton;
