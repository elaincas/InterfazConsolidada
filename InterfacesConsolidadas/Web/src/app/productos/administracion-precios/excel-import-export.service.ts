import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import * as XLSX from 'xlsx';
@Injectable()
export class ExcelImportExportService {
  constructor( ) {


  }
  ExcelToJson<T>(file: any, ): Observable<Array<T>> {
    const excelToJsonObservable = new Observable<Array<T>>((observer) => {
        reader.onload = (e: any) => {
            const bstr: string = e.target.result;
            const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
            /* grab first sheet */
            const wsname: string = wb.SheetNames[0];
            const ws: XLSX.WorkSheet = wb.Sheets[wsname];
            observer.next(XLSX.utils.sheet_to_json(ws) as Array<T>);
            observer.complete();
        };


    });
    const reader = new FileReader();
    const file1 =  file;

    reader.readAsBinaryString(file1);
    return excelToJsonObservable;
}
ExportDataToExcel(data:any[], fileName: string): void {

    /* generate worksheet */
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    /* save to file */
    XLSX.writeFile(wb, fileName);
}

}
