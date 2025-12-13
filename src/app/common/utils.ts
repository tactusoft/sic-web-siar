import { Constants } from './constants';
export class Utils {

    meses = Constants.MESES;

    public getMes(idMes: number): any {
        return this.meses.filter(mes => mes.id === idMes);
    }
}
