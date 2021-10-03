import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageLoaderService {

  constructor(private http: HttpClient) {
  }

  public loadImageDataFromCanvas(url: string): Promise<Uint8Array> {

    const imageToUint8Array = async (image: any, context: any): Promise<Uint8Array> => {
      return new Promise((resolve, reject) => {
        context.width = image.width;
        context.height = image.height;
        context.drawImage(image, 0, 0);
        // context.getImageData(0, 0, image.width, image.height);
        const imgDataUrl = context.toDataURL();
        console.log(`imgDataUrl: ${imgDataUrl}`); // #DEBUG
        context.canvas.toBlob((blob: Blob) => blob.arrayBuffer()
          .then(buffer => {
            resolve(new Uint8Array(buffer))
          }).catch(reject)
        )
      });
    };

    return new Promise((resolve, reject) => {
      const image = new Image();
      image.crossOrigin = 'Anonymous';

      image.onload = async () => {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        const data = await imageToUint8Array(image, context);

        // console.log(`File loaded; ${data.length} bytes`); // #DEBUG

        // convert the image data to base64 string
        // const b64encoded: string = btoa(String.fromCharCode.apply(null, Array.from(data)));
        // const decoder = new TextDecoder('utf8');
        // const b64encoded : string = btoa(decoder.decode(data));

        resolve(data);
      };
      image.onerror = (err) => {
        reject(err);
      };

      image.src = url;
    });
  }

  public loadImageToDataUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this.http.get(url, {responseType: "blob"})
        .subscribe((data: Blob) => {
          const reader = new FileReader();
          reader.onload = () => {
            let dataStr = reader.result;
            // console.log(`FileReader result: ${dataStr}`); // #DEBUG
            resolve('' + dataStr);  // convert to string
          };
          reader.onerror = reject;

          if (data) {
            reader.readAsDataURL(data);
          } else {
            reject('no data loaded');
          }
        }, reject);
    });
  }
}
