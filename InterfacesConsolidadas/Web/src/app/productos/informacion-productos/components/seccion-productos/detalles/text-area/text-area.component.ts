import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: "wysiwyg",
  templateUrl: "./text-area.component.html",
})
export class TextAreaComponent implements OnInit {
  @Output() onEdit: EventEmitter<boolean> = new EventEmitter();

  @Input() formGroupTextArea: FormGroup;

  @Input() validacion: any;

  @Input() submit: boolean;

  @Input() esEdicion: boolean;

  valorOriginal: string;

  modules: any;

  constructor(private sanitizer: DomSanitizer) {
    this.modules = {
      toolbar: [
        ["bold", "italic", "underline", "strike"],
        ["blockquote", "code-block"],

        [{ header: 1 }, { header: 2 }],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ script: "sub" }, { script: "super" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ direction: "rtl" }],

        [{ size: ["small", false, "large", "huge"] }],
        [{ header: [1, 2, 3, 4, 5, 6, false] }],

        [{ color: [].slice() }, { background: [].slice() }],
        [{ font: [].slice() }],
        [{ align: [].slice() }],

        ["clean"],

        ["link"],
      ],
    };
  }

  ngOnInit() {
    this.valorOriginal = this.formGroupTextArea.get("valor").value;
  }

  byPassHTML(html: string) {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  setFocus(event) {
    if (!this.esEdicion) event.focus();
  }

  onContentChanged() {
    this.onEdit.emit(
      this.valorOriginal !== this.formGroupTextArea.get("valor").value
    );
  }
}
