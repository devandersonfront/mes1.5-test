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
      let random_id = Math.random() * 1000;
      return {
        ...row,
        product: row,
        customer_name: row.customer?.name ?? "-",
        customer_model: row.model?.model ?? "-",
        customer_id: row.customer?.name ?? "-",
        cm_id: row.model?.model ?? "-",
        product_id: row.code ?? "-",
        productId: row.product_id ?? "-",
        process_id: row.processId ?? "-",
        modelArray: { model: row.model?.model ?? "-" },
        processArray: { name: row.process?.name ?? "-" },
        customerArray: { name: row.customer?.name ?? "-" },
        name: row.name ?? "-",
        type: !Number.isNaN(row.type)
            ? TransferCodeToValue(row.type, "product")
            : "-",
        unit: row.unit ?? "-",
        id: `stock${random_id}`,
      };
    }

  return (
    <ListContainer noSearch noPeriod buttons={[]} title={titles._stockAdjust} apiKey={'outsourcingImport'} columnKey={'outsourcingImport'} convertToList={convertData} modifyPath={'/mes/outsourcing/import/modify'} searchOptions={optionList}></ListContainer>
  )
}

export { MesStockAdjustList };
