import dayjs from "dayjs";
import { VehicleOccupationItem } from "./service/report_service";

export const OcuppationReportVehicleEntry = ({ item }: { item: VehicleOccupationItem }) => {
    return (
        <div className="capacity-report-item">
            <p className="vehicle">
                Veículo: <span className="value">{item.plate}</span>
                Zona: <span className="value">{item.city_zone}</span>
            </p>
            <div className="occupation-data">
                <span>Capacidade: <span className="value">{item.capacity}</span></span>
                <span>Passageiros: <span className="value">{item.quantity_identifications}</span></span>
                <span>Ocupação: <span className="value occupation-value">{(item.occupation * 100).toFixed(2)}%</span></span>
            </div>
            <div className="occupation-data expected">
                <span>Quantidate esperada: <span className="value">{item.expected_quantity}</span></span>
                <span>Duração:
                    {item.travel_time_seconds ?
                        (<span className="value">
                            {Math.floor(item.travel_time_seconds / 3600).toFixed(0).padStart(2, '0')}:
                            {Math.floor((item.travel_time_seconds % 3600) / 60).toFixed(0).padStart(2, '0')}:
                            {(item.travel_time_seconds % 60).toFixed(0).padStart(2, '0')}
                        </span>) : undefined
                    }
                </span>
                <span>Ocupação (esperado): <span className="value occupation-value">{(item.expected_occupation * 100).toFixed(2)}%</span></span>
            </div>
            <div className="passengers">
                {item.identifications.map(x => (
                    <p key={x.date}>[{dayjs(x.date).format('DD/MM/YYYY HH:mm:ss')}] : {x.text}</p>
                ))}
            </div>
        </div>
    );
}