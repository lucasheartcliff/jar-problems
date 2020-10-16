import * as React from "react";
import { List } from "antd";
import Step from "./Step";

const StepsList: React.FC<any> = ({ data }) => {
  return (
    <List
      dataSource={data}
      renderItem={(item: any) => {
        return <Step {...item} />;
      }}
    />
  );
};

export default StepsList;
