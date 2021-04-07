import React from "react";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import { displayErrorMessage, formatListingPrice } from "../../../../lib/utils";
import moment, { Moment } from "moment";
const { Paragraph, Title } = Typography;

interface Props {
  price: number;
  checkInDate: Moment | null;
  checkOutDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setCheckOutDate: (checkOutDate: Moment | null) => void;
}

export const ListingCreateBooking = ({
  price,
  checkInDate,
  checkOutDate,
  setCheckInDate,
  setCheckOutDate,
}: Props) => {
  const disabledDate = (currentDate?: Moment | null) => {
    if (currentDate) {
      return currentDate.isBefore(moment().endOf("day"));
    } else {
      return false;
    }
  };

  const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
    if (checkInDate && selectedCheckOutDate) {
      if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
        return displayErrorMessage(
          `You can't book a check out date prior to the check in date.`
        );
      }
    }

    setCheckOutDate(selectedCheckOutDate);
  };

  const checkOutInputDisabled: boolean = !checkInDate;
  const buttonDisabled: boolean = !checkInDate || !checkOutDate;

  return (
    <div className="listing-booking">
      <Card className="listing-booking__card">
        <div>
          <Paragraph>
            <Title level={2} className="listing-booking__card-title">
              {formatListingPrice(price)}
              <span>/day</span>
            </Title>
          </Paragraph>

          <Divider />

          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check In</Paragraph>
            <DatePicker
              onChange={(dateValue) => setCheckInDate(dateValue)}
              value={checkInDate ? checkInDate : undefined}
              format={"MM/DD/YYYY"}
              showToday={false}
              disabledDate={disabledDate}
              onOpenChange={() => setCheckOutDate(null)}
            />
          </div>

          <div className="listing-booking__card-date-picker">
            <Paragraph strong>Check Out</Paragraph>
            <DatePicker
              onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
              value={checkOutDate ? checkOutDate : undefined}
              format={"MM/DD/YYYY"}
              showToday={false}
              disabled={checkOutInputDisabled}
              disabledDate={disabledDate}
            />
          </div>
        </div>

        <Divider />

        <Button
          disabled={buttonDisabled}
          size="large"
          type="primary"
          className="listing-booking__card-cta"
        >
          Request to book!
        </Button>
      </Card>
    </div>
  );
};
