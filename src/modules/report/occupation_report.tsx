import { useCallback, useMemo, useState } from "react";
import ReportService, { VehicleOccupationItem } from "./service/report_service";
import '../../index.css'
import dayjs from "dayjs";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { OcuppationReportVehicleEntry } from "./occupation_report_vehicle_entry";
import { MultiSelect } from "primereact/multiselect";

interface Shift {
    start: Date
    end: Date
}

const shifts: Record<string, Shift> = {
    'A': {
        start: dayjs().set('hour', 3).set('minute', 0).set('second', 0).toDate(),
        end: dayjs().set('hour', 6).set('minute', 0).set('second', 0).toDate(),
    },
    'B': {
        start: dayjs().set('hour', 13).set('minute', 0).set('second', 0).toDate(),
        end: dayjs().set('hour', 16).set('minute', 0).set('second', 0).toDate(),
    }
}

export const OccupationReport = () =>{
    const reportService = new ReportService();

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<VehicleOccupationItem[]>()
    const [reportDate, setReportDate] = useState<Date>(
        dayjs().subtract(1, 'day').set('hour', 0).set('minute', 0).set('second', 0).toDate()
    )
    const [fetchErrorModalVisible, setFetchErrorModalVisible] = useState(false) 
    const [comercial, setComercial] = useState('A')
    const [branch, setBranch] = useState(['B1', 'B2'])
    const branches = [
        {
            name: 'Branch 1',
            code: 'B1',
        },
        {
            name: 'Branch 2',
            code: 'B2',
        }
    ];

    const startEndDates = useMemo((): {startDate: Date, endDate: Date} =>{
        const shift = shifts[comercial];
        const startDate = dayjs(reportDate).set('hour', shift.start.getHours()).set('minute', shift.start.getMinutes()).set('second', shift.start.getSeconds()).toDate();
        const endDate = dayjs(reportDate).set('hour', shift.end.getHours()).set('minute', shift.end.getMinutes()).set('second', shift.end.getSeconds()).toDate();
        return { startDate, endDate };
    }, [reportDate, comercial]);

    const handleFetchReport = useCallback(async () =>{
        if(reportDate != null){
            try{
                setLoading(true);
                // const { startDate, endDate } = startEndDates;
                // console.log(startDate);
                // console.log(endDate);
                // const reportData = await reportService.getVehiclesCapacityData(startDate, endDate);
                const reportData = await reportService.getVehiclesCapacityData(reportDate, comercial, branch);
                setData(reportData);
            }catch(e){
                setFetchErrorModalVisible(true);
            }finally{
                setLoading(false);
            }
        }
    }, [startEndDates]);

    const handleExport = useCallback(async () =>{
        if(reportDate != null){
            try{
                setLoading(true);
                //const { startDate, endDate } = startEndDates;
                await reportService.get_report_excel(reportDate, comercial);
            }catch(e){
                setFetchErrorModalVisible(true);
            }finally{
                setLoading(false);
            }
        }
    
    }, [data])

    return (
        <>
            <Dialog header="Falha ao carregar o relatório" 
                    visible={fetchErrorModalVisible} 
                    onHide={() =>{
                        if(fetchErrorModalVisible) {setFetchErrorModalVisible(false)}
                    }}
                    footer={
                        <Button label="Ok" onClick={(e) => {
                            e.preventDefault();
                            setFetchErrorModalVisible(false);
                        }} />
                    }>
                <p>Houve uma falha ao carregar o relatório. Tente novamente em instantes ou entre em contato com o suporte informanto a data e hora do erro.</p>
            </Dialog>
            <section className="capacity-report">
                <div className={"capacity-report-header container "+ (loading ? ' loading-results' : '')}>
                    <div>
                        <h2>Relatório de ocupação</h2>
                        {
                        (loading && (
                            <div className="loading">
                                <i className="pi pi-cog" style={{color: '#1565C0', fontSize: 90}} ></i>
                                <p>
                                    Carregando Relatório para {dayjs(startEndDates.startDate).format('DD/MM/YYYY')} - {comercial} -  {
                                        Object.values(branch).map((b) => branches.find(x => x.code == b)).map((x:any) => x.name).join(', ')
                                    }
                                    <br/> Por favor aguarde...
                                </p>
                            </div>))
                        }
                        {
                            (!loading && (
                                <div className="filters">
                                    <p>Escolha a data para o relatório:</p>
                                    <div className="grid dates-filter flex flex-wrap">
                                        <Calendar
                                            className="col-2"
                                            style={{textAlign: 'center'}}
                                            value={reportDate}
                                            dateFormat="dd/mm/yy"
                                            onChange={(e: any) =>{
                                                setReportDate(e.value);
                                            }} 
                                        />
                                        <div className="p-2 col-4">
                                            <MultiSelect
                                                className="w-full"
                                                style={{textAlign: 'center', maxHeight: 50}}
                                                value={branch}
                                                onChange={(e: any) =>{
                                                    setBranch(e.value);
                                                }}
                                                options={branches}
                                                optionValue="code"
                                                optionLabel="name"
                                                display="chip"
                                            />
                                        </div>                                        
                                        <div className="col-6 flex justify-content-end">
                                            <Button outlined className="export-button" onClick={handleExport}>
                                                <i className="pi pi-download mr-2"></i>
                                                Exportar
                                            </Button>
                                            <Button onClick={handleFetchReport}>Gerar relatório</Button>
                                        </div>
                                        <div className="col-12 flex gap-4">
                                            <div className="pre-defined-timers flex justify-content-between align-items-center">
                                                <div className="flex align-items-center" onClick={() => setComercial('A')}>
                                                    <RadioButton 
                                                        inputId="comercial-a" value="comercial-a" 
                                                        checked={comercial == 'A'}
                                                        
                                                    />
                                                    <label htmlFor="comercial-a" className="ml-2">C.A</label>
                                                </div>
                                            </div>
                                            <div className="pre-defined-timers flex justify-content-between align-items-center">
                                                <div className="flex align-items-center" onClick={() => setComercial('B')}>
                                                    <RadioButton 
                                                        inputId="comercial-b" value="comercial-b" 
                                                        checked={comercial == 'B'}
                                                        />
                                                    <label htmlFor="comercial-b" className="ml-2">C.B</label>
                                                </div>
                                            </div>
                                        </div>
                                    </div>                                   
                                </div>                                                            
                            ))                    
                        }
                        
                    </div>
                </div>
                <div className="capacity-report-result container">
                    <div>
                        {
                            (!loading && 
                                (data ? 
                                    (<div className="result">
                                        <p className="title">
                                            Ocupação <span>{
                                                dayjs(reportDate).format('DD/MM/YYYY')
                                            } - C.{comercial} - {
                                                Object.values(branch).map((b) => branches.find(x => x.code == b)).map((x:any) => x.name).join(', ')
                                            }</span>
                                            {/* <br/> */}
                                            {/* <span>{
                                                dayjs(startEndDates.startDate).format('DD/MM/YYYY HH:mm')
                                            }</span>&nbsp;-&nbsp;<span>{
                                                dayjs(startEndDates.endDate).format('DD/MM/YYYY HH:mm')
                                            }</span> */}
                                        </p>
                                        <div className="items">
                                            {
                                                data.map((x) => <OcuppationReportVehicleEntry item={x} key={x.plate} />)
                                            }
                                        </div>
                                    </div>)
                                    :                    
                                    <p className="no-results-message my-5 py-5">Sem resultados.</p>
                                )
                            )
                        }
                    </div>
                </div>
            </section>
        </>
    );
} 