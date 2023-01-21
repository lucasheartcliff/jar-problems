import React from "react";
import styled from "styled-components";

import Colors from "../../utils/colors";
import { Step as StepType } from "../../types";

const Step: React.FC<any> = ({ type, origin, destiny }: StepType) => {
  const renderContent = () => {
    switch (type) {
      case "drain":
        return (
          <>
            {`The Jar ${destiny.name} content was`}
            <Type color={Colors[type]}>{"drained"}</Type>
            <ReportContainer>
              <Report>
                {` Actual ${destiny.name} size -> ${destiny.currentSize}`}
              </Report>
            </ReportContainer>
          </>
        );
      case "fill":
        return (
          <>
            {`The Jar ${destiny.name} content was`}
            <Type color={Colors[type]}>{"filled"}</Type>
            <ReportContainer>
              <Report>
                {` Actual ${destiny.name} size -> ${destiny.currentSize}`}
              </Report>
            </ReportContainer>
          </>
        );
      case "transfer":
        return (
          <>
            {`The Jar ${origin?.name} content was`}
            <Type color={Colors[type]}>{"transfered"}</Type>
            {`to Jar ${destiny.name}`}
            <ReportContainer>
              <Report>{` Actual ${origin?.name} size -> ${origin?.currentSize}`}</Report>
              <Report>
                {` Actual ${destiny.name} size -> ${destiny.currentSize}`}
              </Report>
            </ReportContainer>
          </>
        );
    }
  };
  return <Container id={"step"}>{renderContent()}</Container>;
};
export default Step;

const Container = styled.div`
  display: flex;
  flex: 1;
  margin: 10px;
  align-items: center;
  color: #9c9c9c;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 5px;
`;

const Type = styled.span`
  margin: 0 5px;
  color: ${({ color }: { color: string }) => color};
  font-weight: 600;
`;
const Report = styled.div`
  font-weight: 550;
  font-size: 10px;
`;
const ReportContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left:auto;
  margin-right: 20px;
`;
