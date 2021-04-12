interface Month {
  [key: string]: boolean;
}

interface Year {
  [key: string]: Month;
}

export interface BookingsIndex {
  [key: string]: Year;
}
