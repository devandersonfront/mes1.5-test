import { ListContainer } from 'shared/src/containers/ListContainer'
import { TransferCodeToValue } from 'shared/src/common/TransferFunction'
import { titles } from 'shared/src/common/menuTitles/titles'

interface IProps {
  children?: any;
  page?: number;
  search?: string;
  option?: number;
}

const optionList = ["거래처", "모델", "CODE", "품명"]

const MesStockAdjustList = ({ page, search, option }: IProps) => {

  const convertData = (row) => {
      return {
        customer_name: row.adjustment_stock.product?.customer?.name ?? "-",
        customer_model: row.adjustment_stock.product?.model?.model ?? "-",
        product_id: row.adjustment_stock.product?.code ?? "-",
        name: row.adjustment_stock.product?.name ?? "-",
        worker: row.worker?.name ?? '-',
        adjust_stock: row.adjustment_stock.adjust_stock,
        involvedRecord: row.involved_record,
        date: row.date
        // customer_id: row.customer?.name ?? "-",
        // cm_id: row.model?.model ?? "-",
        // productId: row.product_id ?? "-",
        // process_id: row.processId ?? "-",
        // modelArray: { model: row.model?.model ?? "-" },
        // processArray: { name: row.process?.name ?? "-" },
        // customerArray: { name: row.customer?.name ?? "-" },
        // type: !Number.isNaN(row.type)
        //     ? TransferCodeToValue(row.type, "product")
        //     : "-",
        // unit: row.unit ?? "-",
        // id: `stock${random_id}`,
      };
    }

  return (
    <ListContainer noSearch buttons={[]} title={titles._stockAdjust} apiKey={'stockAdjust'} columnKey={'stockAdjustList'} convertToList={convertData}></ListContainer>
  )
}

export { MesStockAdjustList };
