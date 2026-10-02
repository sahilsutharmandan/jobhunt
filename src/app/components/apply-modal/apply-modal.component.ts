import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Job } from '../../models/job.model';
import { Application } from '../../models/application.model';
import { ApplicationsService } from '../../services/applications.service';

interface FormErrors {
  fullName: string;
  email: string;
  phone: string;
  resume: string;
}

@Component({
  selector: 'app-apply-modal',
  standalone: true,
  imports: [FormsModule],
  template: `
    @if (job(); as j) {
      <div class="modal-overlay" (click)="close.emit()">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Apply to {{ j.title }}</h2>
            <p class="modal-subtitle">{{ j.company_name }}</p>
            <button class="modal-close" (click)="close.emit()">&times;</button>
          </div>

          <div class="steps">
            <div class="step" [class.step-active]="step() >= 1" [class.step-done]="step() > 1">1</div>
            <div class="step-line" [class.step-line-active]="step() > 1"></div>
            <div class="step" [class.step-active]="step() >= 2" [class.step-done]="step() > 2">2</div>
            <div class="step-line" [class.step-line-active]="step() > 2"></div>
            <div class="step" [class.step-active]="step() >= 3">3</div>
          </div>

          @if (submitted()) {
            <div class="success">
              <div class="success-icon">&#10003;</div>
              <h3>Application Submitted</h3>
              <p>Your application for {{ j.title }} at {{ j.company_name }} has been submitted.</p>
              <button class="btn btn-primary" (click)="close.emit()">Close</button>
            </div>
          } @else {
            @switch (step()) {
              @case (1) {
                <div class="form-step">
                  <label class="form-label">
                    Full Name
                    <input type="text" class="form-input" [(ngModel)]="fullName" placeholder="John Doe" />
                  </label>
                  @if (errors().fullName) {
                    <span class="form-error">{{ errors().fullName }}</span>
                  }

                  <label class="form-label">
                    Email
                    <input type="email" class="form-input" [(ngModel)]="email" placeholder="john@example.com" />
                  </label>
                  @if (errors().email) {
                    <span class="form-error">{{ errors().email }}</span>
                  }

                  <label class="form-label">
                    Phone
                    <input type="tel" class="form-input" [(ngModel)]="phone" placeholder="+1 (555) 123-4567" />
                  </label>
                  @if (errors().phone) {
                    <span class="form-error">{{ errors().phone }}</span>
                  }

                  <div class="form-actions">
                    <button class="btn btn-secondary" (click)="close.emit()">Cancel</button>
                    <button class="btn btn-primary" (click)="validateStep1()">Next</button>
                  </div>
                </div>
              }
              @case (2) {
                <div class="form-step">
                  <label class="form-label">
                    Resume
                    <input type="file" class="form-input form-file" (change)="onFileChange($event)" accept=".pdf,.doc,.docx" />
                  </label>
                  @if (resumeName()) {
                    <p class="file-info">{{ resumeName() }} ({{ formatSize(resumeSize()) }})</p>
                  }
                  @if (errors().resume) {
                    <span class="form-error">{{ errors().resume }}</span>
                  }

                  <label class="form-label">
                    Cover Letter (optional)
                    <textarea class="form-input form-textarea" [(ngModel)]="coverLetter" placeholder="Why are you a great fit for this role?" rows="4"></textarea>
                  </label>

                  <div class="form-actions">
                    <button class="btn btn-secondary" (click)="step.set(1)">Back</button>
                    <button class="btn btn-primary" (click)="validateStep2()">Next</button>
                  </div>
                </div>
              }
              @case (3) {
                <div class="form-step">
                  <div class="review-section">
                    <h4>Personal Details</h4>
                    <p><strong>Name:</strong> {{ fullName }}</p>
                    <p><strong>Email:</strong> {{ email }}</p>
                    <p><strong>Phone:</strong> {{ phone }}</p>
                  </div>
                  <div class="review-section">
                    <h4>Documents</h4>
                    <p><strong>Resume:</strong> {{ resumeName() }} ({{ formatSize(resumeSize()) }})</p>
                    @if (coverLetter) {
                      <p><strong>Cover Letter:</strong> {{ coverLetter.substring(0, 100) }}{{ coverLetter.length > 100 ? '...' : '' }}</p>
                    }
                  </div>

                  <div class="form-actions">
                    <button class="btn btn-secondary" (click)="step.set(2)">Back</button>
                    <button class="btn btn-primary" (click)="submitApplication()">Submit Application</button>
                  </div>
                </div>
              }
            }
          }
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 200;
      padding: 16px;
    }
    .modal {
      background: #fff;
      border-radius: 16px;
      width: 100%;
      max-width: 520px;
      max-height: 90vh;
      overflow-y: auto;
      padding: 28px;
      position: relative;
    }
    .modal-header {
      margin-bottom: 20px;
    }
    .modal-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--color-text);
      margin: 0;
    }
    .modal-subtitle {
      font-size: 0.9rem;
      color: var(--color-muted);
      margin: 4px 0 0;
    }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--color-muted);
      line-height: 1;
    }
    .steps {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0;
      margin-bottom: 24px;
    }
    .step {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 0.85rem;
      color: var(--color-muted);
    }
    .step-active {
      border-color: var(--color-primary);
      color: var(--color-primary);
    }
    .step-done {
      background: var(--color-primary);
      border-color: var(--color-primary);
      color: #fff;
    }
    .step-line {
      width: 48px;
      height: 2px;
      background: #e5e7eb;
    }
    .step-line-active {
      background: var(--color-primary);
    }
    .form-step {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .form-label {
      display: flex;
      flex-direction: column;
      gap: 6px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--color-text);
    }
    .form-input {
      padding: 10px 12px;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
      color: var(--color-text);
    }
    .form-input:focus {
      border-color: var(--color-primary);
    }
    .form-textarea {
      resize: vertical;
      font-family: inherit;
    }
    .form-file {
      padding: 8px;
    }
    .form-error {
      font-size: 0.8rem;
      color: #ef4444;
      margin-top: -8px;
    }
    .file-info {
      font-size: 0.85rem;
      color: var(--color-muted);
      margin: 0;
    }
    .form-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 8px;
    }
    .btn {
      padding: 10px 24px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background 0.2s;
    }
    .btn-primary {
      background: var(--color-primary);
      color: #fff;
    }
    .btn-primary:hover {
      background: #4338ca;
    }
    .btn-secondary {
      background: #f1f5f9;
      color: var(--color-text);
    }
    .btn-secondary:hover {
      background: #e2e8f0;
    }
    .review-section {
      background: #f8fafc;
      border-radius: 8px;
      padding: 16px;
    }
    .review-section h4 {
      margin: 0 0 8px;
      font-size: 0.9rem;
      color: var(--color-primary);
    }
    .review-section p {
      margin: 4px 0;
      font-size: 0.85rem;
      color: var(--color-text);
    }
    .success {
      text-align: center;
      padding: 24px 0;
    }
    .success-icon {
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: #ecfdf5;
      color: #059669;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin: 0 auto 16px;
    }
    .success h3 {
      margin: 0 0 8px;
      color: var(--color-text);
    }
    .success p {
      color: var(--color-muted);
      font-size: 0.9rem;
      margin: 0 0 20px;
    }
  `]
})
export class ApplyModalComponent {
  readonly job = input<Job | null>(null);
  readonly close = output<void>();

  readonly step = signal(1);
  readonly submitted = signal(false);
  readonly resumeName = signal('');
  readonly resumeSize = signal(0);
  readonly errors = signal<FormErrors>({ fullName: '', email: '', phone: '', resume: '' });

  fullName = '';
  email = '';
  phone = '';
  coverLetter = '';

  constructor(private applicationsService: ApplicationsService) {
    this.validateStep1();
  }

  validateStep1(): void {
    const errs: FormErrors = { fullName: '', email: '', phone: '', resume: '' };
    if (!this.fullName.trim()) errs.fullName = 'Name is required';
    if (!this.email.trim() || !this.email.includes('@')) errs.email = 'Valid email is required';
    if (!this.phone.trim()) errs.phone = 'Phone is required';
    this.errors.set(errs);
    if (!errs.fullName && !errs.email && !errs.phone) {
      this.step.set(2);
    }
  }

  validateStep2(): void {
    const errs: FormErrors = { fullName: '', email: '', phone: '', resume: '' };
    if (!this.resumeName()) errs.resume = 'Please select a resume file';
    this.errors.set(errs);
    if (!errs.resume) {
      this.step.set(3);
    }
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.resumeName.set(file.name);
      this.resumeSize.set(file.size);
    }
  }

  submitApplication(): void {
    const j = this.job();
    if (!j) return;

    const application: Application = {
      id: crypto.randomUUID(),
      jobSlug: j.slug,
      jobTitle: j.title,
      companyName: j.company_name,
      fullName: this.fullName,
      email: this.email,
      phone: this.phone,
      resumeName: this.resumeName(),
      resumeSize: this.resumeSize(),
      coverLetter: this.coverLetter,
      status: 'applied',
      appliedAt: Date.now(),
    };

    this.applicationsService.addApplication(application);
    this.submitted.set(true);
  }

  formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }
}
