import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { formData, FormService } from './form.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  form: FormGroup
  formData: formData
  isSubmit = false
  valCapcha = ""
  @ViewChild('captcha') captcha:ElementRef;
  error: string
  @ViewChild('myCanvas') myCanvas: ElementRef;
  context: CanvasRenderingContext2D;

  constructor(private formService: FormService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', Validators.required),
      topic: new FormControl('Техподдержка', Validators.required),
      text: new FormControl('', Validators.required)
    });  
  }

  ngAfterViewInit(): void {
    for(let i = 0; i < 5; i++){
      this.valCapcha += Math.floor(Math.random() * 9.99)
    }

    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d')
    const canvasWidth = this.myCanvas.nativeElement.width
    const canvasHeight = this.myCanvas.nativeElement.height

    this.context.clearRect(0, 0, canvasWidth, canvasHeight)
    this.setLineToCanvas(this.context, 0, canvasHeight/2, canvasWidth, canvasHeight/2)
    for(let i = canvasWidth/10; i < canvasWidth; i+=10){
      this.setLineToCanvas(this.context, i, 0, i, canvasHeight)
    }
    this.context.fillStyle = "#ff7f07"
    this.context.font = "italic 18pt Verdana"
    this.context.fillText(this.valCapcha, 9, 23)
  }

  setLineToCanvas(canvas: CanvasRenderingContext2D, moveToX: number, moveToY: number, lineToX: number, lineTpY: number){
    canvas.strokeStyle = "#FFBB90"
    canvas.moveTo(moveToX, moveToY)
    canvas.lineTo(lineToX, lineTpY)
    canvas.stroke()
  }

  submit() {
    if (this.form.valid && this.form.value.name.trim() && this.form.value.text.trim()) {
      this.formData = {...this.form.value}
      if(this.captcha.nativeElement.value != this.valCapcha){
        this.error = "Капча решена неверно. Попробуйте еще раз"
        return
      }
      
      this.formData['phone'] = '8' + this.formData['phone']
      this.formService.addFormData(this.formData).subscribe(response => {
        this.formData = response
        this.isSubmit = true
      }, error => {
        this.error = error.message
      })
    }
    else{
      alert('Введите все данные')
    }
  }

  back(){
    window.location.reload()
  }
}
