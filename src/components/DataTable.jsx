import RecordTable from "./RecordTable";
import SummaryTable from "./SummaryTable";

const DataTable = ({
  metricsData,
  data,
  originalData,
  handleEdit,
  handleDelete,
}) => {
  return (
    <div className="flex flex-col gap-10">
      <div>
        <SummaryTable metricsData={metricsData} />
      </div>
      <div>
        <RecordTable
          data={data}
          originalData={originalData}
          handleEdit={handleEdit}
          handleDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default DataTable;
