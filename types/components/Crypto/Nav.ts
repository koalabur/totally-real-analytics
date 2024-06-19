export interface Props {
  cryptoTitles: {
    title: string;
    symbol: string;
  }[];
  openingColor: string;
  closingColor: string;
  updateCrypto: (crypto: string) => void;
  legendUpdated: (legend: string) => void;
  availableCrypto: {
    title: string;
    symbol: string;
  }[];
  selectedCrypto: string;
}
