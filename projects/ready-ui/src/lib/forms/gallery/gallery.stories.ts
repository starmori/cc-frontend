import { storiesOf, moduleMetadata } from '@storybook/angular';
import { button } from '@storybook/addon-knobs';

import { GalleryModule } from '@ready-education/ready-ui/forms';
import { ImagesAndIconsModule } from '@ready-education/ready-ui/images-and-icons/images-and-icons.module';

let counter = 0;
const reRender = () => (counter += 1);

let images = [
  'https://source.unsplash.com/random/120x90/?city',
  'https://source.unsplash.com/random/120x90/?people',
  'https://source.unsplash.com/random/120x90/?nature'
];

storiesOf('Gallery', module)
  .addDecorator(
    moduleMetadata({
      imports: [GalleryModule, ImagesAndIconsModule]
    })
  )
  .add('styles', () => {
    button('Refresh Story', reRender);
    return {
      props: {
        images,
        removeImage: (index: number) => {
          images.splice(index, 1);
        },
        addImage: (imageUrl: string) => {
          images = images.concat(imageUrl);
        },
        errorHandler: ({ file }) => alert(`File too big ${file.name}`)
      },
      template: `
      <ready-ui-symbol></ready-ui-symbol>
      <ready-ui-gallery-group>
        <ready-ui-gallery-item
          [src]="image"
          (close)="removeImage(index)"
          *ngFor="let image of images; index as index">
        </ready-ui-gallery-item>
        <ready-ui-gallery-add-item
          (add)="addImage($event)"
          (error)="errorHandler($event)">
        </ready-ui-gallery-add-item>
      </ready-ui-gallery-group>`
    };
  });