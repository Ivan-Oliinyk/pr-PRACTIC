import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as BB from 'bluebird';
import * as fs from 'fs';
import { Types } from 'mongoose';
import * as PdfPrinter from 'pdfmake';
import { EnvironmentVariables } from 'src/config';
import { ScheduleDto } from 'src/entities/routines/dto/ScheduleDto';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '../mailer/mailer.service';
import { AwsUploadService } from '../transformer/AwsUpload.service';

@Injectable()
export class PdfService {
  constructor(
    private http: HttpService,
    private awsUploadService: AwsUploadService,
    private mailerService: MailerService,
    private config: ConfigService<EnvironmentVariables>,
  ) {}

  async getBase64FromUrl(url: string) {
    try {
      return new Promise(resolve => {
        this.http
          .get(url, { responseType: 'arraybuffer' })
          .subscribe((res: any) => {
            const raw = Buffer.from(res.data, 'binary').toString('base64');
            const base64Image =
              'data:' + res.headers['content-type'] + ';base64,' + raw;
            resolve(base64Image);
          });
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBase64FromPngFile(filePath: string) {
    try {
      return new Promise(resolve => {
        const raw = fs.readFileSync(filePath, 'base64');
        const base64Image = 'data:image/png;base64,' + raw;
        resolve(base64Image);
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async generatePdf(
    name: string,
    vsType: string,
    imgURL: string,
    schedule: ScheduleDto,
    activitiesList: {
      name: string;
      duration: number;
      imgURL: string;
      _id: Types.ObjectId;
    }[],
  ) {
    const baseUrl = this.config.get('API_BASE_URL');

    //create required data format for pdf
    const pdfTitle = name + ' ' + vsType;

    let base64Image = null;
    if (imgURL) {
      if (imgURL.includes('static/icons/')) {
        imgURL = baseUrl + imgURL;
      }
      base64Image = await this.getBase64FromUrl(imgURL);
    }

    let startTime = null;
    if (schedule) {
      //all selected days of the week has same start time for the same routine.
      const anyDaySchedule = Object.entries(schedule).find(
        dayTime => dayTime[1].length > 0,
      );
      startTime = anyDaySchedule ? anyDaySchedule[1] : null;
    }

    const clockSvg =
      '<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0.33 24 28"><path d="M16 0.333328H8V2.99999H16V0.333328ZM10.6667 17.6667H13.3333V9.66666H10.6667V17.6667ZM21.3733 8.85333L23.2667 6.95999C22.6933 6.27999 22.0667 5.64 21.3867 5.08L19.4933 6.97333C17.4267 5.31999 14.8267 4.33333 12 4.33333C5.37333 4.33333 0 9.70666 0 16.3333C0 22.96 5.36 28.3333 12 28.3333C18.64 28.3333 24 22.96 24 16.3333C24 13.5067 23.0133 10.9067 21.3733 8.85333ZM12 25.6667C6.84 25.6667 2.66667 21.4933 2.66667 16.3333C2.66667 11.1733 6.84 7 12 7C17.16 7 21.3333 11.1733 21.3333 16.3333C21.3333 21.4933 17.16 25.6667 12 25.6667Z" fill="black"></path></svg>';
    const borderColor = '#72CEBC';
    const tableHeader = [
      {
        stack: [
          {
            text: pdfTitle,
            style: 'pdfTitle',
          },
          startTime
            ? {
                columns: [
                  {
                    svg: clockSvg,
                    style: 'clockIcon',
                    fit: [15, 18],
                    width: 18,
                  },
                  {
                    text: 'Starts at ' + startTime,
                    style: 'startTime',
                    with: 'auto',
                  },
                ],
              }
            : {
                text: '',
              },
        ],
        colSpan: 2,
      },
      {
        text: '',
      },
      base64Image
        ? {
            image: base64Image,
            fit: [60, 60],
            width: 60,
            style: 'routineIcon',
          }
        : {
            text: '',
          },
    ];

    const tableBody = await BB.mapSeries(activitiesList, async activity => {
      let base64Image = null;
      if (activity.imgURL) {
        if (activity.imgURL.includes('.mp4')) {
          //get video first frame as png
          const filePath = await this.awsUploadService.ffmpegGetVideoFrame(
            activity.imgURL,
            activity._id.toString(),
          );
          //get base64 from png file
          base64Image = await this.getBase64FromPngFile(`${filePath}.png`);
          //delete png thumbnail file
          this.deleteFile(`${filePath}.png`);
        } else {
          if (activity.imgURL.includes('static/icons/')) {
            activity.imgURL = baseUrl + activity.imgURL;
          }
          base64Image = await this.getBase64FromUrl(activity.imgURL);
        }
      }

      return [
        base64Image
          ? {
              image: base64Image,
              fit: [45, 45],
              width: 45,
            }
          : { text: '' },
        [
          { text: activity.name, style: 'activityName' },
          activity.duration
            ? {
                columns: [
                  {
                    svg: clockSvg,
                    style: 'clockIcon',
                    fit: [15, 18],
                    width: 18,
                  },
                  {
                    text: activity.duration + ' min',
                    style: 'activityStartTime',
                    with: 'auto',
                  },
                ],
              }
            : { text: '' },
        ],
        {
          canvas: [
            {
              type: 'rect',
              x: 0,
              y: 0,
              w: 40,
              h: 40,
              r: 3,
              lineWidth: 4,
              lineColor: borderColor,
            },
          ],
          style: 'activityBox',
        },
      ];
    });
    const tableFooter = [
      {
        text: 'Make all your schedules at Getgoally.com',
        colSpan: 3,
        style: 'footer',
      },
      {
        text: '',
      },
      {
        text: '',
      },
    ];
    const tableRows = [tableHeader, ...tableBody, tableFooter];

    //configure pdf
    const styles = {
      pdfTitle: {
        fontSize: 22,
        bold: true,
        characterSpacing: 0,
        alignment: 'left',
        lineHeight: 1,
        margin: [0, 7, 0, 0],
      },
      startTime: {
        fontSize: 14,
        characterSpacing: 0,
        alignment: 'left',
        lineHeight: 1,
        margin: [0, 6, 0, 0],
      },
      routineIcon: {
        alignment: 'left',
      },
      activityName: {
        fontSize: 16,
        characterSpacing: 0,
        alignment: 'left',
        lineHeight: 1,
        margin: [0, 2, 0, 0],
      },
      activityStartTime: {
        fontSize: 14,
        characterSpacing: 0,
        alignment: 'left',
        lineHeight: 1,
        margin: [0, 6, 0, 0],
      },
      activityBox: {
        alignment: 'right',
        margin: [0, 0, 2, 0],
      },
      clockIcon: {
        alignment: 'left',
        lineHeight: 1,
        margin: [0, 4, 3, 0],
      },
      footer: {
        fillColor: borderColor,
        fontSize: 14,
        characterSpacing: 0,
        alignment: 'left',
        lineHeight: 1,
        margin: [3, 0, 0, 0],
      },
    };
    const layout = {
      hLineWidth: function(i, node) {
        if (i === 0 || i === node.table.body.length) {
          return 0;
        }
        return i === node.table.headerRows ? 6 : 1;
      },
      vLineWidth: () => 0,
      hLineColor: function(i) {
        return i === 1 ? borderColor : '#FFFFFF';
      },
      paddingLeft: function(i) {
        return i === 0 ? 0 : 8;
      },
      paddingRight: function(i, node) {
        return i === node.table.widths.length - 1 ? 0 : 8;
      },
      paddingTop: () => 6,
      paddingBottom: () => 6,
    };
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [48, 30, 48, 30],
      fillColor: '#E5E5E5',
      defaultStyle: {
        font: 'Rubik',
      },
      styles: styles,

      content: [
        {
          layout: layout,
          table: {
            headerRows: 1,
            widths: [54, '*', 60],
            body: tableRows,
          },
        },
      ],
    };
    const fonts = {
      Rubik: {
        normal: 'static/fonts/rubik/static/Rubik-Regular.ttf',
        bold: 'static/fonts/rubik/static/Rubik-Bold.ttf',
        italics: 'static/fonts/rubik/static/Rubik-Italic.ttf',
        bolditalics: 'static/fonts/rubik/static/Rubik-BoldItalic.ttf',
      },
    };
    const options = {};

    //create pdf
    const printer = new PdfPrinter(fonts);
    const filePath = `./static/uploads/${pdfTitle}.pdf`;
    const pdfDoc = printer.createPdfKitDocument(docDefinition, options);
    const writeStream = fs.createWriteStream(filePath);
    pdfDoc.pipe(writeStream);
    pdfDoc.end();

    //wait for pdf to be created
    await new Promise(async (res, rej) => {
      writeStream.on('finish', function(err, data) {
        if (err) {
          console.log('err is', err);
          rej(err);
        }
        res(data);
      });
    });
    return filePath;
  }

  async uploadPdfToS3(pdfPath) {
    let res;
    res = await this.awsUploadService.uploadPdfFiletoS3(
      pdfPath,
      'application/pdf',
      `routines/pdf/${Date.now()}_${uuidv4()}`,
    );
    this.deleteFile(pdfPath);
    return res.Location;
  }

  deleteFile(fileName: string) {
    fs.unlink(fileName, console.log);
  }

  async emailPdf(email: string, pdfUrl: string) {
    return await this.mailerService.sendRoutinePdfMail({ email }, pdfUrl);
  }
}
