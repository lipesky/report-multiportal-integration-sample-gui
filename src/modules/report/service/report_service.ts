import dayjs from "dayjs"
import api from "../../../shared/api"

export interface VehicleOccupationItem {
  vehicle_id: number
  plate: string
  capacity: number
  quantity_identifications: number
  identifications: Array<OccupationItemIdentification>
  occupation: number
  expected_occupation: number
  expected_quantity: number
  travel_time_seconds?: number
  city_zone?: string
  branches: string[]
}
export interface OccupationItemIdentification {
  text: string
  date: string
}

export default class ReportService {
  base_url = import.meta.env.VITE_API_URL;
  async get_report_excel(date: Date, comercial_id: string) {
    const response = await api.get(
      `/report/capacity-xlsx?date=${dayjs(date).format('YYYY-MM-DD HH:mm:00')}&comercial_id=${comercial_id}`,
      {
        responseType: 'blob',
      }
    );
    if (response.status == 200) {
      const href = URL.createObjectURL(response.data);
      const link = document.createElement('a');
      link.href = href;
      const filename = `Relatório de ocupação ${dayjs(date).format('YYYY-MM-DD')} - C${comercial_id}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    } else {
      throw new Error()
    }
  }

  async getVehiclesCapacityData(date: Date, comercialId: string, branches: string[]): Promise<VehicleOccupationItem[]> {
    const response  = await api.get<VehicleOccupationItem[]>(
      `/report/capacity?date=${dayjs(date).format('YYYY-MM-DD HH:mm:00')}&comercial_id=${comercialId.toUpperCase()}&branches=${branches.join(',')}`
    );
    if(response.status == 200){
        return response.data;
    }
    throw new Error()
    /*let resolve: any;
    const p = new Promise<VehicleOccupationItem[]>((res) => {
      resolve = res
    })
    setTimeout(() => resolve([

      {
        "vehicle_id": 100001,
        "plate": "ABC123",
        "capacity": 23,
        "quantity_identifications": 4,
        "identifications": [
          {
            "text": "Fulano",
            "date": "2024-11-16T03:54:46"
          },
          {
            "text": "Ciclano",
            "date": "2024-11-16T04:08:12"
          },
          {
            "text": "Beltrano",
            "date": "2024-11-16T04:08:54"
          },
          {
            "text": "ADRIANA",
            "date": "2024-11-16T04:14:06"
          }
        ],
        "occupation": 0.17391304347826086,
        "expected_occupation": 0.21052631578947367,
        "expected_quantity": 19,
        "travel_time_seconds": 1160
      },
      {
        "vehicle_id": 100002,
        "plate": "CDF567",
        "capacity": 31,
        "quantity_identifications": 10,
        "identifications": [
          {
            "text": "Mateus",
            "date": "2024-11-16T03:08:33"
          },
          {
            "text": "DILMA",
            "date": "2024-11-16T03:20:43"
          },
          {
            "text": "Maria",
            "date": "2024-11-16T03:34:59"
          },
          {
            "text": "Katrina",
            "date": "2024-11-16T03:35:15"
          },
          {
            "text": "CATARINA",
            "date": "2024-11-16T03:44:59"
          },
          {
            "text": "LUANA",
            "date": "2024-11-16T03:49:27"
          },
          {
            "text": "Lucas M",
            "date": "2024-11-16T03:51:56"
          },
          {
            "text": "Caio G",
            "date": "2024-11-16T04:02:24"
          },
          {
            "text": "Flávia B",
            "date": "2024-11-16T04:03:06"
          },
          {
            "text": "Leonardo",
            "date": "2024-11-16T04:07:44"
          }
        ],
        "occupation": 0.3225806451612903,
        "expected_occupation": 0.45454545454545453,
        "expected_quantity": 22,
        "travel_time_seconds": 3551
      },
      
    ]), 2000);
    return await p;*/

  }
}